const analyzeTimeline_prompt = [`
주요 플롯을 뽑아내기 위해 아래 조건을 참고하여 소설의 핵심 사건들을 추출하세요.

조건:
1. 소설의 시작부터 끝까지의 주요 사건을 시간 순서대로 나열하세요.
2. 각 사건은 간결하고 명확하게 표현하세요.
3. 사건은 소설의 전체 이야기 흐름을 이해하는 데 필수적인 요소여야 합니다.
4. 주요 인물의 결정적 행동이나 변화, 중요한 사건의 발생 등을 포함하세요.
5. 일반적인 배경 설명이나 세부 묘사는 제외하고, 핵심 사건에 집중하세요.
6. 답변은 아래 예시의 "주요 플롯:" 이후부터 1.부터 작성하면 됩니다.

예시 1:
소설 내용:
"존은 어린 시절부터 꿈꾸던 모험을 시작하기로 결심했다. 그는 친구인 사라와 함께 먼 나라로 떠났다. 여행 중 그들은 여러 가지 도전에 직면했고, 최종적으로 보물을 발견했다. 그러나 그 과정에서 그들은 여러 희생을 치렀다."

주요 플롯:
1. 존의 모험 결심
2. 사라와 함께 출발
3. 도전과 난관에 직면
4. 보물 발견
5. 희생과 대가

예시 2:
소설 내용:
"에밀리는 작은 마을에서 자라났다. 그녀는 항상 도시로 나가 큰 꿈을 이루고 싶어했다. 어느 날, 기회가 찾아왔고, 에밀리는 도시로 떠났다. 도시에 도착한 그녀는 여러 사람을 만나며 성장했다. 결국 그녀는 자신의 꿈을 이뤘다."

주요 플롯:
1. 에밀리의 큰 꿈
2. 도시로 떠날 기회
3. 도시에 도착
4. 다양한 사람들과의 만남
5. 꿈의 실현

이제 주어진 소설에 대해 주요 플롯을 뽑아주세요:

소설 내용:
"{소설 원본 텍스트}"

주요 플롯: `, `
다음 소설의 주요 사건 내용을 요약하세요. 각 사건의 핵심 내용을 간략하게 서술하고, 사건의 중요성을 설명하세요.

조건:
1. 제시된 각각의 플롯(사건)에 초점을 맞추어 요약하세요. 
2. 답변은 예시의 "주요 사건 요약:" 이후부터 1.부터 작성하면 됩니다.

예시:
소설 내용:
"존은 1995년 여름, 모험을 떠나기로 결심했다. 그해 7월, 그는 친구 사라와 함께 출발했다. 그들은 8월 말에 험난한 산을 넘었고, 9월 초에는 고대의 보물을 발견했다."

주요 플롯: 
1. 존의 모험 결심
2. 사라와 함께 출발
3. 험난한 산을 넘음
4. 고대의 보물 발견

주요 사건 요약:
1. 존의 모험 결심: 존은 새로운 경험을 찾아 모험을 떠나기로 결심한다.
2. 사라와 함께 출발: 존과 사라는 함께 모험을 시작한다.
3. 험난한 산을 넘음: 두 사람은 여러 어려움을 극복하고 산을 넘는다.
4. 고대의 보물 발견: 두 사람은 마침내 보물을 발견한다.


이제 주어진 소설에 대해 각 주요 사건의 내용을 요약하세요.

소설 내용:
"{소설 원본 텍스트}"

주요 플롯:
{1번 프롬프트의 출력 결과}

주요 사건 요약:
`, `
아래 소설의 주요 사건들을 뽑아서, 순서대로 JSON 배열에 담아 제시해주세요. 

조건:
1. 사설달지 말고 [{cardTitle: "사건명1", cardDetailedText: "사건의 간략한 설명1"}, {cardTitle: "사건명2", cardDetailedText: "사건의 간략한 설명2"}, ...]의 JSON 배열 형태로 답장하세요. 
2. cardTitle 변수에는 사건의 이름을 넣고, cardDetailedText 에는 이 사건이 뭔지 간략하게 설명하면 됩니다.
3. 모든 key-value들은 반드시 쌍따옴표("")로 감싸져야 합니다.

예시:
분석 내용:
1. 존의 모험 결심: 존은 새로운 경험을 찾아 모험을 떠나기로 결심한다.
2. 사라와 함께 출발: 존과 사라는 함께 모험을 시작한다.
3. 험난한 산을 넘음: 두 사람은 여러 어려움을 극복하고 산을 넘는다.
4. 고대의 보물 발견: 두 사람은 마침내 보물을 발견한다.

JSON 객체:
[
  {"cardTitle": "존의 모험 결심", "cardDetailedText": "존은 새로운 경험을 찾아 모험을 떠나기로 결심한다."},
  {"cardTitle": "사라와 함께 출발", "cardDetailedText": "존과 사라는 함께 모험을 시작한다."},
  {"cardTitle": "험난한 산을 넘음", "cardDetailedText": "두 사람은 여러 어려움을 극복하고 산을 넘는다."},
  {"cardTitle": "고대의 보물 발견", "cardDetailedText": "두 사람은 마침내 보물을 발견한다."}
]

이제 주어진 소설에 대해 각 주요 사건의 시기와 요약 내용을 JSON 배열 형태로 나열하세요.
오로지 배열 '만' 반환하세요.


분석 내용:
{2번 프롬프트의 출력 결과}

JSON 객체:
`
]

module.exports = analyzeTimeline_prompt;