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
        const { title, content } = req.body;
        // OpenAI API 처리
        // ...


        // 현재까지의 글 저장
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while updating the post' });
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

        // OpenAI API 처리
        // ...

        // 현재까지의 글 저장
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while updating the post' });
    }
};