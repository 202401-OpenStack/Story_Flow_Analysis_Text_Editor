exports.checkAuth = async (req, res) => {
  try {
    // 세션 정보를 체크하여 사용자 인증 상태 확인
    if (req.session.username) {
      // 인증된 사용자
      return res.status(200).json({
        message: "User is authenticated.",
        data: {
          authenticated: true,
          username: req.session.username
        }
      });
    } else {
      // 인증되지 않은 사용자
      return res.status(200).json({
        message: "User is not authenticated.",
        data: {
          authenticated: false,
        }
      });
    }
  } catch (error) {
    // 서버 내부 오류 처리
    console.error('Authentication check error:', error);
    return res.status(500).json({
      message: "Internal server error occurred while checking authentication."
    });
  }
};