const axios = require('axios');
require('dotenv').config();

// 요약하기
exports.summarizeArticle = async (req, res) => {
    try {
        // 세션에서 accountId 추출
        const accountId = req.session.accountId;
        if (!accountId) {
            // 사용자가 로그인하지 않았다면 에러 처리
            return res.status(401).json({ message: 'You must be logged in to access summarizeArticle API' });
        }
        // 클라이언트로부터 데이터 받아오기
        const { content } = req.body;

        // OpenAI API에 필요한 헤더 설정
        const headers = {
            'Content-Type': 'application/json',
            'api-key': process.env.OPENAI_API_KEY
        }
        // OpenAI API에 요청 보내기
        const apiUrl = `https://aoai-test-ian.openai.azure.com/openai/deployments/gpt35/chat/completions?api-version=2024-02-01`;
        
        const prompt = `아래 입력된 숫자들을 그대로 반환하시오. 따로 다른 말 붙이지 말고, "숫자만" 반환하시오. 예시: 3 3 3 -> 3 3 3, 5 7 1 -> 5 7 1: \n\n${content}`;
        const dataAPI = {
            messages: [{
                "role": "system",
                "content": prompt
            }
            ]
        };

        const response = await axios.post(apiUrl, dataAPI, {headers});

        // message의 content 부분만 추출
        const messageContent = response.data.choices[0].message.content;

        // OpenAI API로부터 받은 응답을 클라이언트에 전송
        return res.status(200).json({
            message: "Article successfully summarized",
            data: messageContent
        });


        // 현재까지의 글 저장
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing summarizeArticle API' });
    }
};

// 주제 찾기
exports.findTopic = async (req, res) => {
    try {
        // 세션에서 accountId 추출
        const accountId = req.session.accountId;
        if (!accountId) {
            // 사용자가 로그인하지 않았다면 에러 처리
            return res.status(401).json({ message: 'You must be logged in to access findTopic API' });
        }
        // 클라이언트로부터 데이터 받아오기
        const { content } = req.body;

        // OpenAI API에 필요한 헤더 설정
        const headers = {
            'Content-Type': 'application/json',
            'api-key': process.env.OPENAI_API_KEY
        }
        // OpenAI API에 요청 보내기
        const apiUrl = `https://aoai-test-ian.openai.azure.com/openai/deployments/gpt35/chat/completions?api-version=2024-02-01`;
        
        const prompt = `아래 글의 주제를 짧게 요약해서 제시하시오.: \n\n${content}`;
        const dataAPI = {
            messages: [{
                "role": "system",
                "content": prompt
            }
            ]
        };

        const response = await axios.post(apiUrl, dataAPI, {headers});
        console.log('openAI API access');

        // message의 content 부분만 추출
        const messageContent = response.data.choices[0].message.content;

        // OpenAI API로부터 받은 응답을 클라이언트에 전송
        return res.status(200).json({
            message: "Topic identification completed successfully",
            data: messageContent
        });


        // 현재까지의 글 저장
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing findTopic API' });
    }
};

// 키워드 추출
exports.extractKeywords = async (req, res) => {
    try {
        // 세션에서 accountId 추출
        const accountId = req.session.accountId;
        if (!accountId) {
            // 사용자가 로그인하지 않았다면 에러 처리
            return res.status(401).json({ message: 'You must be logged in to access extractKeywords API' });
        }
        // 클라이언트로부터 데이터 받아오기
        const { content } = req.body;

        // OpenAI API에 필요한 헤더 설정
        const headers = {
            'Content-Type': 'application/json',
            'api-key': process.env.OPENAI_API_KEY
        }
        // OpenAI API에 요청 보내기
        const apiUrl = `https://aoai-test-ian.openai.azure.com/openai/deployments/gpt35/chat/completions?api-version=2024-02-01`;
        
        const prompt = `아래 글에서 키워드를 3개 추출하여 쉼표로 구분해서 작성하시오: \n\n${content}`;
        const dataAPI = {
            messages: [{
                "role": "system",
                "content": prompt
            }
            ]
        };

        const response = await axios.post(apiUrl, dataAPI, {headers});

        // message의 content 부분만 추출
        const messageContent = response.data.choices[0].message.content;

        // OpenAI API로부터 받은 응답을 클라이언트에 전송
        return res.status(200).json({
            message: "Keyword extraction completed successfully",
            data: messageContent
        });


        // 현재까지의 글 저장
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing extractKeywords API' });
    }
};

// 인물 수 분석
exports.analyzeCharacterCount = async (req, res) => {
    try {
        // 세션에서 accountId 추출
        const accountId = req.session.accountId;
        if (!accountId) {
            // 사용자가 로그인하지 않았다면 에러 처리
            return res.status(401).json({ message: 'You must be logged in to access analyzeCharacterCount API' });
        }
        // 클라이언트로부터 데이터 받아오기
        const { content } = req.body;

        // OpenAI API에 필요한 헤더 설정
        const headers = {
            'Content-Type': 'application/json',
            'api-key': process.env.OPENAI_API_KEY
        }
        // OpenAI API에 요청 보내기
        const apiUrl = `https://aoai-test-ian.openai.azure.com/openai/deployments/gpt35/chat/completions?api-version=2024-02-01`;
        
        const prompt = `아래 글에서 등장하는 인물의 수와 이름을 작성하시오. 만약 이름이 명시되지 않았다면 글에 나온 대로(그 사람, 선생 등) 작성하시오. [작성 예: 3, 철수, 영희, 길동]: \n\n${content}`;
        const dataAPI = {
            messages: [{
                "role": "system",
                "content": prompt
            }
            ]
        };

        const response = await axios.post(apiUrl, dataAPI, {headers});

        // message의 content 부분만 추출
        const messageContent = response.data.choices[0].message.content;

        // OpenAI API로부터 받은 응답을 클라이언트에 전송
        return res.status(200).json({
            message: "Analyzing character counts completed successfully",
            data: messageContent
        });


        // 현재까지의 글 저장
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing analyzeCharacterCount API' });
    }
};

// 이야기 흐름 판단
exports.judgeStoryFlow = async (req, res) => {
    try {
        // 세션에서 accountId 추출
        const accountId = req.session.accountId;
        if (!accountId) {
            // 사용자가 로그인하지 않았다면 에러 처리
            return res.status(401).json({ message: 'You must be logged in to access judgeStoryFlow API' });
        }
        // 클라이언트로부터 데이터 받아오기
        const { content } = req.body;

        // OpenAI API에 필요한 헤더 설정
        const headers = {
            'Content-Type': 'application/json',
            'api-key': process.env.OPENAI_API_KEY
        }
        // OpenAI API에 요청 보내기
        const apiUrl = `https://aoai-test-ian.openai.azure.com/openai/deployments/gpt35/chat/completions?api-version=2024-02-01`;
        
        const prompt = `다음 글의 흐름이 전통적인 소설 방식을 따르는지 평가하시오. 보완이 필요한 부분이 있다면 어떤 식으로 고쳐야 하는지 피드백하시오.: \n\n${content}`;
        const dataAPI = {
            messages: [{
                "role": "system",
                "content": prompt
            }
            ]
        };

        const response = await axios.post(apiUrl, dataAPI, {headers});

        // message의 content 부분만 추출
        const messageContent = response.data.choices[0].message.content;

        // OpenAI API로부터 받은 응답을 클라이언트에 전송
        return res.status(200).json({
            message: "Judging the story flow completed successfully",
            data: messageContent
        });


        // 현재까지의 글 저장
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing judgeStoryFlow API' });
    }
};