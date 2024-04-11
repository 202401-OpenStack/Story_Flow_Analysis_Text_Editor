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
        
        const prompt = `20자 이내로 아래 텍스트를 요약하시오.: \n\n${content}`;
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