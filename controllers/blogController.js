require('dotenv').config();
const { Post, Photo } = require('../models');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

// Azure Blob Storage 설정
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.CONTAINER_NAME;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

// Base64 URL 찾기 위한 정규 표현식
const base64Regex = /data:image\/(png|jpeg|jpg);base64,([a-zA-Z0-9+/=]+)/;

const uploadBase64ImageToBlob = async (base64String) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  
  const matches = base64String.match(base64Regex);
  if (!matches) {
    console.error('Invalid base64 string:', base64String);
    throw new TypeError('Invalid base64 string');
  }

  const contentType = matches[1];
  const base64Data = matches[2];
  
  if (!base64Data) {
    console.error('Base64 data is undefined:', base64String);
    throw new TypeError('Base64 data is undefined');
  }

  const buffer = Buffer.from(base64Data, 'base64');
  const blobName = `${uuidv4()}.${contentType}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: `image/${contentType}`,
    },
  });

  return blockBlobClient.url;
};

// 글 목록 가져오기
exports.getPosts = async (req, res) => {
  try {
    const accountId = req.session.accountId;

    // 사용자가 로그인하지 않았다면 에러 처리
    if (!accountId) {
      return res.status(401).json({ message: 'You must be logged in to check posts' })
    }

    // 로그인한 사용자의 글만 출력.
    const posts = await Post.findAll({
      where: {
        accountId: accountId
      }
    });
    res.status(200).json({
      message: "Posts fetched successfully",
      data: posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving posts' });
  }
};

// 글 작성하기
exports.createPost = async (req, res) => {
  try {
    // 세션에서 accountId 추출
    const accountId = req.session.accountId;
    if (!accountId) {
      // 사용자가 로그인하지 않았다면 에러 처리
      return res.status(401).json({ message: 'You must be logged in to create a post' });
    }

    let { title, content } = req.body;

     // base64 이미지 URL들을 찾아서 Blob Storage에 업로드하고, 링크로 대체함
     const base64RegexGlobal = new RegExp(base64Regex.source, 'g');
     let match;
     const photoUrls = []; // 업로드된 이미지 URL을 저장할 배열
     while ((match = base64RegexGlobal.exec(content)) !== null) {
       const base64Url = match[0];
       try {
         const blobUrl = await uploadBase64ImageToBlob(base64Url);
         console.log('Blob URL:', blobUrl);
         content = content.replace(base64Url, blobUrl);
         photoUrls.push(blobUrl); // 업로드된 이미지 URL을 배열에 추가
       } catch (uploadError) {
         console.error('Error uploading image to Blob:', uploadError);
         return res.status(500).json({ message: 'An error occurred while uploading the image' });
       }
     }

    const data = await Post.create({ title, content, accountId });
    // Photo 테이블에 이미지 URL을 저장
    const photoRecords = photoUrls.map(url => ({ postId: data.id, url }));
    await Photo.bulkCreate(photoRecords);

    res.status(201).json({
      message: "Post created successfully",
      data: data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while creating the post' });
  }
};

// 특정 글 가져오기
exports.getPost = async (req, res) => {
  try {
    // 세션에서 accountId 추출
    const accountId = req.session.accountId;
    if (!accountId) {
      // 사용자가 로그인하지 않았다면 에러 처리
      return res.status(401).json({ message: 'You must be logged in to check the post' });
    }

    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({
      message: "Post retrieved successfully",
      data: post
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving the post' });
  }
};

// 글 수정하기
exports.updatePost = async (req, res) => {
  try {
    // 세션에서 accountId 추출
    const accountId = req.session.accountId;
    if (!accountId) {
      // 사용자가 로그인하지 않았다면 에러 처리
      return res.status(401).json({ message: 'You must be logged in to update the post' });
    }

    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    let { title, content } = req.body;

    // 기존 사진 URL들을 가져옴
    const existingPhotos = await Photo.findAll({ where: { postId } });
    const existingPhotoUrls = existingPhotos.map(photo => photo.url);

    // base64 이미지 URL들을 찾아서 Blob Storage에 업로드하고, 링크로 대체함
    const base64RegexGlobal = new RegExp(base64Regex.source, 'g');
    let match;
    const newPhotoUrls = []; // 새로 업로드된 이미지 URL을 저장할 배열
    while ((match = base64RegexGlobal.exec(content)) !== null) {
      const base64Url = match[0];
      try {
        const blobUrl = await uploadBase64ImageToBlob(base64Url);
        console.log('Blob URL:', blobUrl);
        content = content.replace(base64Url, blobUrl);
        newPhotoUrls.push(blobUrl); // 업로드된 이미지 URL을 배열에 추가
      } catch (uploadError) {
        console.error('Error uploading image to Blob:', uploadError);
        return res.status(500).json({ message: 'An error occurred while uploading the image' });
      }
    }

    // 기존 URL 중 사용되지 않는 URL 찾기
    const unusedPhotoUrls = existingPhotoUrls.filter(url => !content.includes(url));

    // Blob Storage에서 사용되지 않는 이미지 삭제
    for (const url of unusedPhotoUrls) {
      try {
        await deleteBlobImage(url); // 실제로 이미지를 Blob Storage에서 삭제하는 함수
      } catch (deleteError) {
        console.error('Error deleting image from Blob:', deleteError);
        return res.status(500).json({ message: 'An error occurred while deleting the image' });
      }
    }

    // Photo 테이블에서 사용되지 않는 이미지 URL 레코드 삭제
    await Photo.destroy({ where: { url: unusedPhotoUrls } });

    // Photo 테이블에 새 이미지 URL 저장
    const photoRecords = newPhotoUrls.map(url => ({ postId: postId, url }));
    await Photo.bulkCreate(photoRecords);

    // 글 수정
    await post.update({ title, content });

    res.status(200).json({
      message: "Post updated successfully",
      data: post
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while updating the post' });
  }
};

const deleteBlobImage = async (url) => {
  // URL에서 컨테이너 이름과 Blob 이름을 추출하는 로직이 필요합니다.
  // 예시로 URL 형식이 'https://<account_name>.blob.core.windows.net/<container_name>/<blob_name>'이라고 가정합니다.
  
  const urlParts = url.split('/');
  const containerName = urlParts[3]; // 컨테이너 이름
  const blobName = urlParts.slice(4).join('/'); // Blob 이름

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  try {
    await blobClient.delete();
    console.log(`Blob deleted successfully: ${url}`);
  } catch (error) {
    console.error(`Error deleting blob: ${url}`, error);
    throw error;
  }
};

// 글 삭제하기
exports.deletePost = async (req, res) => {
  try {
    // 세션에서 accountId 추출
    const accountId = req.session.accountId;
    if (!accountId) {
      // 사용자가 로그인하지 않았다면 에러 처리
      return res.status(401).json({ message: 'You must be logged in to delete the post' });
    }
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 연관된 이미지 URL들을 가져옴
    const photos = await Photo.findAll({ where: { postId } });
    const photoUrls = photos.map(photo => photo.url);

    // Blob Storage에서 이미지 삭제
    for (const url of photoUrls) {
      try {
        await deleteBlobImage(url); // 실제로 이미지를 Blob Storage에서 삭제하는 함수
      } catch (deleteError) {
        console.error('Error deleting image from Blob:', deleteError);
        return res.status(500).json({ message: 'An error occurred while deleting the image' });
      }
    }

    // Photo 테이블에서 이미지 URL 레코드 삭제
    await Photo.destroy({ where: { postId } });

    await post.destroy();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while deleting the post' });
  }
};