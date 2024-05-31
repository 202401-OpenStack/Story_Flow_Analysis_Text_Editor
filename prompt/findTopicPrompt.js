const findTopic_prompt = [`주요 플롯을 뽑아내기 위해 아래 조건을 참고하여 소설의 핵심 사건들을 추출하세요.

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

주요 플롯:`,
`소설의 작가 의도와 메시지를 분석하기 위해 아래 조건을 참고하여 서술하세요.

조건:
1. 작가가 이 소설을 통해 전달하고자 하는 주된 메시지를 식별하세요.
2. 작가의 의도를 설명하세요. 왜 이 이야기를 쓰게 되었는지, 무엇을 강조하고 싶은지 분석하세요.
3. 소설의 특정 장면이나 대사를 통해 작가의 메시지가 어떻게 전달되는지 설명하세요.
6. 답변은 아래 예시의 "작가의 의도 분석:" 이후부터 1.부터 작성하면 됩니다.

예시:
소설 내용:
"존은 어린 시절부터 꿈꾸던 모험을 시작하기로 결심했다. 그는 친구인 사라와 함께 먼 나라로 떠났다. 여행 중 그들은 여러 가지 도전에 직면했고, 최종적으로 보물을 발견했다. 그러나 그 과정에서 그들은 여러 희생을 치렀다."

작가의 의도 분석:
1. 주된 메시지:
   - 모험을 통해 성장하고, 꿈을 이루기 위해서는 용기와 희생이 필요하다는 것을 강조한다.

2. 작가의 의도:
   - 이 소설을 통해 작가는 사람들이 자신의 꿈을 추구하고 모험을 떠나는 것의 중요성을 강조하고자 했다. 또한, 그 과정에서의 어려움과 희생이 결국 개인의 성장을 이끈다는 점을 전달하고 싶어 했다.

3. 메시지 전달 방법:
   - 특정 장면: 존과 사라가 험난한 여정을 함께하며 서로를 격려하는 장면은 우정과 협력의 중요성을 보여준다.
   - 특정 대사: "우리가 포기하지 않는 한, 우리는 결국 목표에 도달할 거야."라는 존의 말은 작가의 메시지를 직접적으로 전달한다.

 작가는 이를 통해 독자들에게 다시 꿈을 추구할 용기를 불어넣고자 했다.

이제 주어진 소설에 대해 작가의 의도와 메시지를 분석하여 서술해주세요:

소설 내용:
"{소설 원본 텍스트}"

작가의 의도 분석:`,
`주어진 소설의 주제를 추출하기 위해 아래 조건을 참고하여 서술하세요.

조건:

1. 주요 플롯을 통해 소설의 핵심 내용을 요약하세요.
2. 작가의 의도와 메시지를 바탕으로 소설의 주제를 도출하세요.
3. 주제는 소설의 전체적인 의미와 교훈을 아우를 수 있어야 합니다.
4. 답변은 아래 예시의 "소설의 주제:" 이후부터 1.부터 작성하면 됩니다. "소설의 주제: "라는 말은 쓰지 말고, 실제 내용만 적으면 됩니다.
예시:
1번 프롬프트의 출력 결과:

존의 모험 결심
사라와 함께 출발
도전과 난관에 직면
보물 발견
희생과 대가

2번 프롬프트의 출력 결과:

주된 메시지:
모험을 통해 성장하고, 꿈을 이루기 위해서는 용기와 희생이 필요하다는 것을 강조한다.

작가의 의도:
이 소설을 통해 작가는 사람들이 자신의 꿈을 추구하고 모험을 떠나는 것의 중요성을 강조하고자 했다. 또한, 그 과정에서의 어려움과 희생이 결국 개인의 성장을 이끈다는 점을 전달하고 싶어 했다.

메시지 전달 방법:
특정 장면: 존과 사라가 험난한 여정을 함께하며 서로를 격려하는 장면은 우정과 협력의 중요성을 보여준다.
특정 대사: "우리가 포기하지 않는 한, 우리는 결국 목표에 도달할 거야."라는 존의 말은 작가의 메시지를 직접적으로 전달한다.

소설의 주제:
1. 꿈을 이루기 위해서는 용기와 희생이 필요하다.
2. 모험과 도전은 개인의 성장에 중요한 요소이다.
3. 우정과 협력은 어려움을 극복하는 데 중요한 역할을 한다.

이제 주어진 소설에 대해 주제를 도출하세요:

1번 프롬프트의 출력 결과:
"{1번 프롬프트의 출력 결과}"

2번 프롬프트의 출력 결과:
"{2번 프롬프트의 출력 결과}"

소설의 주제:`
]

module.exports = findTopic_prompt;