const axios = require('axios');
require('dotenv').config();

// 코드 리팩토링
const openAiRequest = async (content, promptTemplate) => {
    const headers = {
        'Content-Type': 'application/json',
        'api-key': process.env.OPENAI_API_KEY
    };
    const apiUrl = `https://aoai-test-ian.openai.azure.com/openai/deployments/gpt35/chat/completions?api-version=2024-02-01`;

    const prompt = promptTemplate(content);
    const dataAPI = {
        messages: [{
            "role": "system",
            "content": prompt
        }]
    };

    const response = await axios.post(apiUrl, dataAPI, { headers });
    return response.data.choices[0].message.content;
};

const handleRequest = async (req, res, promptTemplate, successMessage) => {
    try {
        const accountId = req.session.accountId;
        if (!accountId) {
            return res.status(401).json({ message: 'You must be logged in to access this API' });
        }
        const { content } = req.body;
        const messageContent = await openAiRequest(content, promptTemplate);
        return res.status(200).json({
            message: successMessage,
            data: messageContent
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing the API' });
    }
};

// 요약하기
exports.summarizeArticle = (req, res) => {
    handleRequest(req, res, 
        content => `아래 내용을 20자 이내로 요약하시오: \n\n${content}`, 
        "Article successfully summarized"
    );
};

// 주제 찾기
exports.findTopic = (req, res) => {
    handleRequest(req, res, 
        content => `아래 글의 주제를 짧게 요약해서 제시하시오.: \n\n${content}`, 
        "Topic identification completed successfully"
    );
};

// 키워드 추출
exports.extractKeywords = (req, res) => {
    handleRequest(req, res, 
        content => `아래 글에서 키워드를 3개 추출하여 쉼표로 구분해서 작성하시오: \n\n${content}`, 
        "Keyword extraction completed successfully"
    );
};

// 인물 수 분석
exports.analyzeCharacterCount = (req, res) => {
    handleRequest(req, res, 
        content => `아래 글에서 등장하는 인물들을 작성하세요. 만약 이름이 명시되지 않았다면 글에 나온 대로(그 사람, 선생 등) 작성하세요. 사설 달지 말고 "철수, 영희, 길동" 처럼 따옴표로 구분해서 작성하세요.: \n\n${content}`, 
        "Analyzing character counts completed successfully"
    );
};

// 이야기 흐름 판단
exports.judgeStoryFlow = (req, res) => {
    handleRequest(req, res, 
        content => `다음 글의 흐름이 전통적인 소설 방식을 따르는지 평가하시오. 보완이 필요한 부분이 있다면 어떤 식으로 고쳐야 하는지 피드백하시오.: \n\n${content}`, 
        "Judging the story flow completed successfully"
    );
};

// 인물 관계 분석
exports.analyzeCharacterRelationships = (req, res) => {
    handleRequest(req, res, 
        content => `아래 글을 읽고 등장인물과, 각 등장인물들의 관계를 배열을 포함한 JSON 형태로 적어 반환하세요. 사설 달지 말고 데이터만 보내야 하며, 데이터 형식은 아래 예시처럼 맞추세요.
        {
            'character': [{id: 1, name: "이름1"}, {id: 2, name: "이름2"}, ..],
            'links': [{source: "이름1", target: "이름2", relationship: "관계(예:친구)"}, {source: "이름2", target: "이름1", relationship: "관계(예:짝사랑)"}, ...]
        }
        두 번째 배열의 경우 모든 등장인물을 적을 필요는 없으며, 글에서 언급되는 relationship만을 적으세요. : \n\n${content}`, 
        "Analyzing Character Relationships completed successfully"
    );
};

// 타임라인 분석
exports.analyzeTimeline = (req, res) => {
    handleRequest(req, res, 
        content => `아래 글에서 주요 사건들을 뽑아서, 순서대로 items라는 JSON 객체 변수로 제시해주세요. 
        사설달지 말고 [{cardTitle: "사건명1", cardDetailedText: "사건의 간략한 설명1"}, {cardTitle: "사건명2", cardDetailedText: "사건의 간략한 설명2"}, ...] 형태로 답장하세요. 
        cardTitle 변수에는 사건의 이름을 넣고, cardDetailedText 에는 이 사건이 뭔지 간략하게 설명하면 됩니다. : \n\n${content}`, 
        "Analyzing Timeline completed successfully"
    );
};