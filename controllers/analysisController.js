const axios = require('axios');
require('dotenv').config();

const common_prompt = require('../prompt/commonPrompt');
const summarizeArticle_prompt = require('../prompt/summarizeArticlePrompt');
const findTopic_prompt = require('../prompt/findTopicPrompt');
const extractKeywords_prompt = require('../prompt/extractKeywordsPrompt');
const analyzeCharacterCount_prompt = require('../prompt/analyzeCharacterCountPrompt');
const analyzeCharacterRelationships_prompt = require('../prompt/analyzeCharacterRelationshipsPrompt');
const analyzeTimeline_prompt = require('../prompt/analyzeTimelinePrompt');
const judgeStoryFlow_prompt = require('../prompt/judgeStoryFlowPrompt');

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
            "role": "user",
            "content": prompt
        }],
        max_tokens: 1000,
        temperature: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 0.95,
        stop: null
    };

    const response = await axios.post(apiUrl, dataAPI, { headers });
    return response.data.choices[0].message.content;
};

// 글을 500토큰 단위로 100토큰씩 겹치게 분리
const splitContent = (content, maxTokens = 500, overlap = 100) => {
    const words = content.split(/\s+/);
    const chunks = [];
    for (let i = 0; i < words.length; i += (maxTokens - overlap)) {
        chunks.push(words.slice(i, i + maxTokens).join(' '));
        if (i + maxTokens >= words.length) {
            break;
        }
    }
    return chunks;
};

const extractJsonContent = (message) => {
    // 정규 표현식을 사용하여 ```json``` 블록 제거
    const regex = /```json\s*([\s\S]*?)\s*```/;
    const match = message.match(regex);

    // 매치된 경우 JSON 내용 추출, 아니면 원래 메시지 반환
    if (match && match[1]) {
        return match[1];
    } else {
        return message;
    }
};

// 요약하기
exports.summarizeArticle = async (req, res) => {
    const prompt_policy = (content) => `${common_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt_summary = (content) => `${common_prompt[1]}: ${content}`;
    const prompt1 = (content) => `${summarizeArticle_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt2 = (content) => `${summarizeArticle_prompt[1].replace('{소설 원본 텍스트}', content)}`;
    const prompt3 = (message1, message2) => `${summarizeArticle_prompt[2].replace('{1번 프롬프트의 출력 결과}', message1).replace('{2번 프롬프트의 출력 결과}', message2)}`
    try {
        const accountId = req.session.accountId;
        if (!accountId) {
            return res.status(401).json({ message: 'You must be logged in to access this API' });
        }

        const { content } = req.body;

        // 글이 너무 짧은 경우
        if (content.length <= 10) {
            return res.status(500).json({ message: '글이 너무 짧습니다' });
        }

        const tokenCount = content.split(/\s+/).length;
        let finalContent = content;

        if (tokenCount > 500) {
            console.log("500토큰이 넘습니다");
            const chunks = splitContent(content);

            let summaries = [];
            for (const chunk of chunks) {
                const policyCheck = await openAiRequest(chunk, prompt_policy);
                if (policyCheck === "부적절한 내용") {
                    return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.' });
                }

                const summary = await openAiRequest(chunk, prompt_summary);
                summaries.push(summary);
            }
            finalContent = summaries.join(' ');
        }

        else {
            const policy = await openAiRequest(finalContent, prompt_policy);

            if (policy === "부적절한 내용") {
                return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.'});
            }
            else if (policy === "무의미한 문자열") {
                return res.status(500).json({ message: '분석이 불가능한 텍스트입니다. 올바른 내용을 작성한 후 다시 시도해주세요.'});
            }
        }

        const message1 = await openAiRequest(finalContent, prompt1);
        const message2 = await openAiRequest(finalContent, prompt2);
        const message3 = await openAiRequest(finalContent, (content) => prompt3(message1, message2));

        return res.status(200).json({
            message: "Article successfully summarized",
            data: message3
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing the API' });
    }
};

// 주제 찾기
exports.findTopic = async (req, res) => {
    const prompt_policy = (content) => `${common_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt_summary = (content) => `${common_prompt[1]}: ${content}`;
    const prompt1 = (content) => `${findTopic_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt2 = (content) => `${findTopic_prompt[1].replace('{소설 원본 텍스트}', content)}`;
    const prompt3 = (message1, message2) => `${findTopic_prompt[2].replace('{1번 프롬프트의 출력 결과}', message1).replace('{2번 프롬프트의 출력 결과}', message2)}`
    try {
        const accountId = req.session.accountId;
        if (!accountId) {
            return res.status(401).json({ message: 'You must be logged in to access this API' });
        }

        const { content } = req.body;

        // 글이 너무 짧은 경우
        if (content.length <= 10) {
            return res.status(500).json({ message: '글이 너무 짧습니다' });
        }

        const tokenCount = content.split(/\s+/).length;
        let finalContent = content;

        if (tokenCount > 500) {
            console.log("500토큰이 넘습니다");
            const chunks = splitContent(content);

            let summaries = [];
            for (const chunk of chunks) {
                const policyCheck = await openAiRequest(chunk, prompt_policy);
                if (policyCheck === "부적절한 내용") {
                    return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.' });
                }

                const summary = await openAiRequest(chunk, prompt_summary);
                summaries.push(summary);
            }
            finalContent = summaries.join(' ');
        }

        else {
            const policy = await openAiRequest(finalContent, prompt_policy);

            if (policy === "부적절한 내용") {
                return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.'});
            }
            else if (policy === "무의미한 문자열") {
                return res.status(500).json({ message: '분석이 불가능한 텍스트입니다. 올바른 내용을 작성한 후 다시 시도해주세요.'});
            }
        }

        const message1 = await openAiRequest(finalContent, prompt1);
        const message2 = await openAiRequest(finalContent, prompt2);
        const message3 = await openAiRequest(finalContent, (content) => prompt3(message1, message2));

        return res.status(200).json({
            message: "Topic identification completed successfully",
            data: message3
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing the API' });
    }
};

// 키워드 추출
exports.extractKeywords = async (req, res) => {
    const prompt_policy = (content) => `${common_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt_summary = (content) => `${common_prompt[1]}: ${content}`;
    const prompt1 = (content) => `${extractKeywords_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt2 = (content) => `${extractKeywords_prompt[1].replace('{소설 원본 텍스트}', content)}`;
    const prompt3 = (message1, message2) => `${extractKeywords_prompt[2].replace('{1번 프롬프트의 출력 결과}', message1).replace('{2번 프롬프트의 출력 결과}', message2)}`
    try {
        const accountId = req.session.accountId;
        if (!accountId) {
            return res.status(401).json({ message: 'You must be logged in to access this API' });
        }

        const { content } = req.body;

        // 글이 너무 짧은 경우
        if (content.length <= 10) {
            return res.status(500).json({ message: '글이 너무 짧습니다' });
        }

        const tokenCount = content.split(/\s+/).length;
        let finalContent = content;

        if (tokenCount > 500) {
            console.log("500토큰이 넘습니다");
            const chunks = splitContent(content);

            let summaries = [];
            for (const chunk of chunks) {
                const policyCheck = await openAiRequest(chunk, prompt_policy);
                if (policyCheck === "부적절한 내용") {
                    return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.' });
                }

                const summary = await openAiRequest(chunk, prompt_summary);
                summaries.push(summary);
            }
            finalContent = summaries.join(' ');
        }

        else {
            const policy = await openAiRequest(finalContent, prompt_policy);

            if (policy === "부적절한 내용") {
                return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.'});
            }
            else if (policy === "무의미한 문자열") {
                return res.status(500).json({ message: '분석이 불가능한 텍스트입니다. 올바른 내용을 작성한 후 다시 시도해주세요.'});
            }
        }

        const message1 = await openAiRequest(finalContent, prompt1);
        const message2 = await openAiRequest(finalContent, prompt2);
        const message3 = await openAiRequest(finalContent, (content) => prompt3(message1, message2));

        return res.status(200).json({
            message: "Keyword extraction completed successfully",
            data: message3
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing the API' });
    }
};

// 인물 수 분석
exports.analyzeCharacterCount = async (req, res) => {
    const prompt_policy = (content) => `${common_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt_summary = (content) => `${common_prompt[1]}: ${content}`;
    const prompt1 = (content) => `${analyzeCharacterCount_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt2 = (content, message1) => `${analyzeCharacterCount_prompt[1].replace('{소설 원본 텍스트}', content).replace('{1번 프롬프트의 출력 결과}', message1)}`;
    const prompt3 = (message1, message2) => `${analyzeCharacterCount_prompt[2].replace('{1번 프롬프트의 출력 결과}', message1).replace('{2번 프롬프트의 출력 결과}', message2)}`
    try {
        const accountId = req.session.accountId;
        if (!accountId) {
            return res.status(401).json({ message: 'You must be logged in to access this API' });
        }

        const { content } = req.body;

        // 글이 너무 짧은 경우
        if (content.length <= 10) {
            return res.status(500).json({ message: '글이 너무 짧습니다' });
        }

        const tokenCount = content.split(/\s+/).length;
        let finalContent = content;

        if (tokenCount > 500) {
            console.log("500토큰이 넘습니다");
            const chunks = splitContent(content);

            let summaries = [];
            for (const chunk of chunks) {
                const policyCheck = await openAiRequest(chunk, prompt_policy);
                if (policyCheck === "부적절한 내용") {
                    return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.' });
                }

                const summary = await openAiRequest(chunk, prompt_summary);
                summaries.push(summary);
            }
            finalContent = summaries.join(' ');
        }

        else {
            const policy = await openAiRequest(finalContent, prompt_policy);

            if (policy === "부적절한 내용") {
                return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.'});
            }
            else if (policy === "무의미한 문자열") {
                return res.status(500).json({ message: '분석이 불가능한 텍스트입니다. 올바른 내용을 작성한 후 다시 시도해주세요.'});
            }
        }

        const message1 = await openAiRequest(finalContent, prompt1);
        const message2 = await openAiRequest(finalContent, (content) => prompt2(finalContent, message1));
        const message3 = await openAiRequest(finalContent, (content) => prompt3(message1, message2));

        return res.status(200).json({
            message: "Analyzing character counts completed successfully",
            data: message3
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing the API' });
    }
};

// 이야기 흐름 판단
exports.judgeStoryFlow = async (req, res) => {
    const prompt_policy = (content) => `${common_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt_summary = (content) => `${common_prompt[1]}: ${content}`;
    const prompt1 = (content) => `${judgeStoryFlow_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt2 = (content) => `${judgeStoryFlow_prompt[1].replace('{소설 원본 텍스트}', content)}`;
    const prompt3 = (content) => `${judgeStoryFlow_prompt[2].replace('{소설 원본 텍스트}', content)}`;
    const prompt4 = (message1, message2, message3) => `${judgeStoryFlow_prompt[3].replace('{1번 프롬프트의 출력 결과}', message1).replace('{2번 프롬프트의 출력 결과}', message2).replace('{3번 프롬프트의 출력 결과}')}`
    try {
        const accountId = req.session.accountId;
        if (!accountId) {
            return res.status(401).json({ message: 'You must be logged in to access this API' });
        }

        const { content } = req.body;

        // 글이 너무 짧은 경우
        if (content.length <= 10) {
            return res.status(500).json({ message: '글이 너무 짧습니다' });
        }

        const tokenCount = content.split(/\s+/).length;
        let finalContent = content;

        if (tokenCount > 500) {
            console.log("500토큰이 넘습니다");
            const chunks = splitContent(content);

            let summaries = [];
            for (const chunk of chunks) {
                const policyCheck = await openAiRequest(chunk, prompt_policy);
                if (policyCheck === "부적절한 내용") {
                    return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.' });
                }

                const summary = await openAiRequest(chunk, prompt_summary);
                summaries.push(summary);
            }
            finalContent = summaries.join(' ');
        }

        else {
            const policy = await openAiRequest(finalContent, prompt_policy);

            if (policy === "부적절한 내용") {
                return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.'});
            }
            else if (policy === "무의미한 문자열") {
                return res.status(500).json({ message: '분석이 불가능한 텍스트입니다. 올바른 내용을 작성한 후 다시 시도해주세요.'});
            }
        }

        const message1 = await openAiRequest(finalContent, prompt1);
        const message2 = await openAiRequest(finalContent, prompt2);
        const message3 = await openAiRequest(finalContent, prompt3);
        const message4 = await openAiRequest(finalContent, (content) => prompt3(message1, message2, message3));

        return res.status(200).json({
            message: "Topic identification completed successfully",
            data: message4
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing the API' });
    }
};

// 인물 관계 분석
exports.analyzeCharacterRelationships = async (req, res) => {
    const prompt_policy = (content) => `${common_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt_summary = (content) => `${common_prompt[1]}: ${content}`;
    const prompt1 = (content) => `${analyzeCharacterRelationships_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt2 = (content, message1) => `${analyzeCharacterRelationships_prompt[1].replace('{소설 원본 텍스트}', content).replace('{1번 프롬프트의 출력 결과}', message1)}`;
    const prompt3 = (message2) => `${analyzeCharacterRelationships_prompt[2].replace('{2번 프롬프트의 출력 결과}', message2)}`
    try {
        const accountId = req.session.accountId;
        if (!accountId) {
            return res.status(401).json({ message: 'You must be logged in to access this API' });
        }

        const { content } = req.body;

        // 글이 너무 짧은 경우
        if (content.length <= 10) {
            return res.status(500).json({ message: '글이 너무 짧습니다' });
        }

        const tokenCount = content.split(/\s+/).length;
        let finalContent = content;

        if (tokenCount > 500) {
            console.log("500토큰이 넘습니다");
            const chunks = splitContent(content);

            let summaries = [];
            for (const chunk of chunks) {
                const policyCheck = await openAiRequest(chunk, prompt_policy);
                if (policyCheck === "부적절한 내용") {
                    return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.' });
                }

                const summary = await openAiRequest(chunk, prompt_summary);
                summaries.push(summary);
            }
            finalContent = summaries.join(' ');
        }

        else {
            const policy = await openAiRequest(finalContent, prompt_policy);

            if (policy === "부적절한 내용") {
                return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.'});
            }
            else if (policy === "무의미한 문자열") {
                return res.status(500).json({ message: '분석이 불가능한 텍스트입니다. 올바른 내용을 작성한 후 다시 시도해주세요.'});
            }
        }

        const message1 = await openAiRequest(finalContent, prompt1);
        const message2 = await openAiRequest(finalContent, (content) => prompt2(finalContent, message1));
        const message3 = await openAiRequest(finalContent, (content) => prompt3(message2));

        return res.status(200).json({
            message: "Analyzing Character Relationships completed successfully",
            data: message3
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing the API' });
    }
};

// 타임라인 분석
exports.analyzeTimeline = async (req, res) => {
    const prompt_policy = (content) => `${common_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt_summary = (content) => `${common_prompt[1]}: ${content}`;
    const prompt1 = (content) => `${analyzeTimeline_prompt[0].replace('{소설 원본 텍스트}', content)}`;
    const prompt2 = (content, message1) => `${analyzeTimeline_prompt[1].replace('{소설 원본 텍스트}', content).replace('{1번 프롬프트의 출력 결과}', message1)}`;
    const prompt3 = (message2) => `${analyzeTimeline_prompt[2].replace('{2번 프롬프트의 출력 결과}', message2)}`
    try {
        const accountId = req.session.accountId;
        if (!accountId) {
            return res.status(401).json({ message: 'You must be logged in to access this API' });
        }

        const { content } = req.body;

        // 글이 너무 짧은 경우
        if (content.length <= 10) {
            return res.status(500).json({ message: '글이 너무 짧습니다' });
        }

        const tokenCount = content.split(/\s+/).length;
        let finalContent = content;

        if (tokenCount > 500) {
            console.log("500토큰이 넘습니다");
            const chunks = splitContent(content);

            let summaries = [];
            for (const chunk of chunks) {
                const policyCheck = await openAiRequest(chunk, prompt_policy);
                if (policyCheck === "부적절한 내용") {
                    return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.' });
                }

                const summary = await openAiRequest(chunk, prompt_summary);
                summaries.push(summary);
            }
            finalContent = summaries.join(' ');
        }

        else {
            const policy = await openAiRequest(finalContent, prompt_policy);

            if (policy === "부적절한 내용") {
                return res.status(500).json({ message: '욕설, 반사회적 내용 등 부적절한 내용이 포함돼있습니다.'});
            }
            else if (policy === "무의미한 문자열") {
                return res.status(500).json({ message: '분석이 불가능한 텍스트입니다. 올바른 내용을 작성한 후 다시 시도해주세요.'});
            }
        }

        const message1 = await openAiRequest(finalContent, prompt1);
        const message2 = await openAiRequest(finalContent, (content) => prompt2(finalContent, message1));
        const message3 = await openAiRequest(finalContent, (content) => prompt3(message2));

        return res.status(200).json({
            message: "Analyzing Timeline completed successfully",
            data: message3
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while accessing the API' });
    }
};