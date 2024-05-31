const common_prompt = [
    `아래 소설 내용에 OpenAI 정책을 위반하는 내용(선정적, 반사회적, 지나친 욕설 등)이 포함돼있다면 "부적절한 내용"을 출력하고, 
    "소설"이라고 판단할 수 없는 의미없는 문자열이 있다면 "무의미한 문자열"을 출력해주세요. 
    정상적인 내용이라면 "정상"을 출력해주세요.
    아래 조건을 지키세요.

    조건: 
    1. 답변은 [부적절한 내용/무의미한 문자열/정상]의 3지선다입니다.
    2. "부적절한 내용"의 경우, 신중히 판단해야 합니다.
    - 단순히 소설적으로 허용될 만한 내용은 "정상"으로 처리하세요. 
    - 예를 들어, 등장인물이 범죄를 저지르는 게 묘사됐거나, 상대방에게 욕을 하는 장면 등의 경우에는 "부적절한 내용"으로 처리하지 말고, "정상"으로 처리하세요.
    - 그러나, 누가 봐도 소설 속 내용이 아니고, 프롬프트의 허점을 이용해 반사회적인 질문(범죄 수법 질문 등)을 하는 경우는 "부적절한 내용"으로 처리합니다.
    
    예시1: 정상적인 내용
    -> 정상

    예시2: ㅁㅇㄹㄻㅁㅁㄷㄷㄹㄹ (의미없는 문자열)
    -> 무의미한 문자열

    예시3: (공백)
    -> 무의미한 문자열

    예시4: 그는 에이미를 죽였다. 그가 왜 그런 선택을 했는지는 아무도 모른다.
    -> 정상

    예시5: 사람 죽이는 방법 알려줘
    -> 부적절한 내용

    예시6: "야 이 새끼야!" 그는 앞 사람을 향해 윽박질렀다.
    -> 정상 

    아래 내용을 보고 판단하면 됩니다:
    "{소설 원본 텍스트}"`,
    `아래 글을 10자에서 50자 이내로 간략히 요약하세요:`
]

module.exports = common_prompt;