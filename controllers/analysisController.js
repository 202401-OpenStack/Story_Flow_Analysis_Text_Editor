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
        
        const prompt = `아래 내용을 20자 이내로 요약하시오: \n\n${content}`;
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
        
        const prompt = `아래 글에서 등장하는 인물들을 작성하세요. 만약 이름이 명시되지 않았다면 글에 나온 대로(그 사람, 선생 등) 작성하세요. 사설 달지 말고 "철수, 영희, 길동" 처럼 따옴표로 구분해서 작성하세요.: \n\n${content}`;
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

// 시각화

// 인물 관계 분석
exports.analyzeCharacterRelationships = async (req, res) => {
    try {
        // 세션에서 accountId 추출
        const accountId = req.session.accountId;
        if (!accountId) {
            // 사용자가 로그인하지 않았다면 에러 처리
            return res.status(401).json({ message: 'You must be logged in to access analyzeCharacterRelationships API' });
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
        
        const prompt = `아래 글을 읽고 등장인물과, 각 등장인물들의 관계를 배열을 포함한 JSON 형태로 적어 반환하세요. 사설 달지 말고 데이터만 보내야 하며, 데이터 형식은 아래 예시처럼 맞추세요.
        {
            'character': [{id: 1, name: "이름1"}, {id: 2, name: "이름2"}, ..],
            'links': [{source: "이름1", target: "이름2", relationship: "관계(예:친구)"}, {source: "이름2", target: "이름1", relationship: "관계(예:짝사랑)"}, ...]
        }
        두 번째 배열의 경우 모든 등장인물을 적을 필요는 없으며, 글에서 언급되는 relationship만을 적으세요. : \n\n${content}`;
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
            message: "Analyzing Character Relationships completed successfully",
            data: messageContent
        });


        // 현재까지의 글 저장
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing analyzeCharacterRelationships API' });
    }
};

// 타임라인 분석
exports.analyzeTimeline = async (req, res) => {
    try {
        // 세션에서 accountId 추출
        const accountId = req.session.accountId;
        if (!accountId) {
            // 사용자가 로그인하지 않았다면 에러 처리
            return res.status(401).json({ message: 'You must be logged in to access analyzeTimeline API' });
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
        
        const prompt = `아래 글에서 주요 사건들을 뽑아서, 순서대로 items라는 JSON 객체 변수로 제시해주세요. 
        사설달지 말고 [{cardTitle: "사건명1", cardDetailedText: "사건의 간략한 설명1"}, {cardTitle: "사건명2", cardDetailedText: "사건의 간략한 설명2"}, ...] 형태로 답장하세요. 
        cardTitle 변수에는 사건의 이름을 넣고, cardDetailedText 에는 이 사건이 뭔지 간략하게 설명하면 됩니다. : \n\n${content}`;
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
            message: "Analyzing Timeline completed successfully",
            data: messageContent
        });


        // 현재까지의 글 저장
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing analyzeTimeline API' });
    }
};