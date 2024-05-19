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
        }],
        max_tokens: 1000
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
        content => `
        다음 소설의 작문 수준을 평가해 주세요. 각 항목에 대해 구체적으로 피드백해주세요. 다음 기준에 따라 평가해 주세요:

1. **플롯 전개**
    - 이야기의 흐름이 논리적이고 일관성이 있는가?
    - 이야기가 흥미를 끌고 긴장감을 유지하는가?
    - 기승전결이 잘 구성되어 있는가?

2. **캐릭터 개발**
    - 등장인물들이 생동감 있고 다차원적으로 그려졌는가?
    - 각 인물의 동기와 행동이 이야기 전개에 잘 부합하는가?
    - 주인공과 주요 인물들의 성장이 명확하게 묘사되었는가?

3. **설정과 배경**
    - 이야기의 배경이 구체적이고 생생하게 그려졌는가?
    - 배경 설정이 이야기와 잘 맞물리고 일관성이 있는가?
    - 독자가 배경과 설정에 쉽게 몰입할 수 있는가?

4. **문체와 문법**
    - 글의 문체가 일관되고 적절한가?
    - 문법과 맞춤법이 정확한가?
    - 문장이 명확하고 읽기 쉬운가?

5. **전반적인 인상**
    - 소설이 독자를 끌어들이고 감동을 주는가?
    - 이야기의 전반적인 완성도가 높은가?
    - 소설을 읽은 후 독자에게 강한 인상을 남기는가?

평가 글 작성 방법은 아래 양식대로만 해주세요. 각 문장은 20자 내외로 유지하세요.

1. 플롯 전개: ~하기 때문에 논리적이고 일관성이 있으며(혹은 반대), ~하므로 독자의 흥미를 끌고 긴장감을 유지하며(혹은 반대), ~하므로 기승전결이 잘 구성되어 있습니다(혹은 반대).
2. 캐릭터 개발: ~하기 때문에 생동감 있고 다차원적으로 그려졌으며(혹은 반대), ~하므로 각 인물의 동기와 행동이 이야기 전개에 잘 부합하며(혹은 반대), ~하므로 주인공 및 주요 인물들의 성장이 명확하게 묘사됩니다(혹은 반대).
3. 설정과 배경: ~하기 때문에 이야기의 배경이 구체적이고 생생하게 그려지며(혹은 반대), ~하므로 배경 설정이 이야기와 잘 맞물리고 일관성이 있으며(혹은 반대), ~하므로 독자가 배경과 설정에 쉽게 몰입할 수 있습니다(혹은 반대).
4. 문체와 문법: ~하기 때문에 글의 문체가 일관되고 적절하며(혹은 반대), 문법과 맞춤법이 정확하며(혹은 반대, 반대일 경우 이 부분에 오류가 있다고 말하기), 문장이 명확하고 읽기 쉽습니다(혹은 반대).
5. 전반적인 인상: ~하기 때문에 소설이 독자를 끌어들이고 감동을 주며(혹은 반대), ~하므로 이야기의 전반적인 완성도가 높으며(혹은 반대), ~하므로 소설을 읽은 후 독자에게 강한 인상을 남깁니다(혹은 반대).
6. 결론: 올바름/올바르지 않음 (2지선다이며, 6번 결론 항목에서만 표시하세요)
7. 추가 피드백: 자유롭게 (예시가 있어도 좋음)

소설 내용:
        \n\n${content}`, 
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