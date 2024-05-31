const analyzeCharacterRelationships_prompt = [`
소설의 주요 인물을 뽑아내기 위해 아래 조건을 참고하여 인물들을 추출하세요.

조건:
1. 소설의 주요 사건과 플롯에 중요한 역할을 하는 인물을 식별하세요.
2. 각 인물의 이름과 간략한 설명을 포함하세요.
3. 인물의 주요 특성, 역할, 그리고 소설 내에서의 중요성을 서술하세요.
4. 단순히 등장만 하는 인물보다는 이야기의 전개에 중요한 영향을 미치는 인물을 중심으로 뽑아내세요.
5. 답변은 아래 예시의 "주요 인물:" 이후부터 1. 2. 이런 식으로 작성하면 됩니다.

예시:
소설 내용:
"존은 어린 시절부터 꿈꾸던 모험을 시작하기로 결심했다. 그는 친구인 사라와 함께 먼 나라로 떠났다. 여행 중 그들은 여러 가지 도전에 직면했고, 최종적으로 보물을 발견했다. 그러나 그 과정에서 그들은 여러 희생을 치렀다."

주요 인물:
1. 존: 모험을 결심한 주인공으로, 어린 시절부터 모험을 꿈꿔왔다. 그의 결심과 행동이 이야기를 이끌어간다.
2. 사라: 존의 친구이자 동료 모험가로, 여행에 함께하며 여러 도전을 극복하는 데 중요한 역할을 한다.

예시:
소설 내용:
"에밀리는 작은 마을에서 자라났다. 그녀는 항상 도시로 나가 큰 꿈을 이루고 싶어했다. 어느 날, 기회가 찾아왔고, 에밀리는 도시로 떠났다. 도시에 도착한 그녀는 여러 사람을 만나며 성장했다. 결국 그녀는 자신의 꿈을 이뤘다."

주요 인물:
1. 에밀리: 작은 마을 출신으로, 도시에서 꿈을 이루기 위해 노력하는 주인공. 그녀의 성장과 성공이 이야기의 핵심이다.
2. 도시에서 만난 사람들: 에밀리의 성장을 도와주는 조력자들로, 각각의 만남이 그녀의 인생에 중요한 영향을 미친다.

이제 주어진 소설에 대해 주요 인물을 뽑아주세요:

소설 내용:
"{소설 원본 텍스트}"

주요 인물:
`, `
소설의 인물 간 관계를 분석하기 위해 아래 조건을 참고하여 서술하세요.

조건:
1. 주요 인물들 간의 관계를 분석하세요.
2. 각 인물이 다른 인물과 맺고 있는 관계의 성격을 설명하세요.
3. 주요 인물들 간의 갈등이나 협력, 애정 관계 등을 식별하고 설명하세요.
4. 관계 분석을 통해 소설의 전개에 어떻게 기여하는지 설명하세요.

예시:
소설 내용:
"존은 어린 시절부터 꿈꾸던 모험을 시작하기로 결심했다. 그는 친구인 사라와 함께 먼 나라로 떠났다. 여행 중 그들은 여러 가지 도전에 직면했고, 최종적으로 보물을 발견했다. 그러나 그 과정에서 그들은 여러 희생을 치렀다."

주요 인물:
- 존: 주인공, 모험가
- 사라: 존의 친구이자 동료 모험가

인물 간 관계 분석:
1. 존과 사라:
   - 관계의 성격: 친구이자 동료
   - 관계 설명: 두 사람은 서로를 지지하며 어려움을 함께 극복하는 동반자 관계이다.
   - 갈등/협력: 주요 사건에서 항상 협력하며, 서로에게 의지한다.
   - 전개 기여: 두 사람의 협력과 지지는 이야기의 중심축을 이루며, 모험의 성공에 중요한 역할을 한다.

이제 주어진 소설에 대해 인물 간 관계를 분석하여 서술해주세요:

소설 내용:
"{소설 원본 텍스트}"

주요 인물:
{1번 프롬프트의 출력 결과}

인물 간 관계 분석:
`, `
아래 글을 읽고 등장인물과, 각 등장인물들의 관계를 배열을 포함한 JSON 형태로 적어 반환하세요. 

조건:
1. 인물 간 관계 분석 내용을 기반으로 합니다.
2. links는 모든 등장인물들 간의 경우의 수를 전부 적을 필요는 없으며, 글에서 언급되는 relationships만을 적으세요.
3. links의 source, target에는 character 배열에 직접 언급됐던 이름만 나와야 합니다.
4. relationship은 10자 이내로 아주 간결하게 작성해야 합니다.
5. 모든 key-value들은 반드시 쌍따옴표("")로 감싸져야 합니다.
6. 답변은 무조건 JSON 데이터만 하세요. 다른 사설을 붙이면 안됩니다.

답변 예시:
{
    "character": [
        {"id": "이름1", "name": "이름1"}, 
        {"id": "이름2", "name": "이름2"},
        ...
    ],
    "links": [
        {"source": "이름1", "target": "이름2", "relationship": "관계(예: 친구)"}, 
        {"source": "이름2", "target": "이름1", "relationship": "관계(예: 짝사랑)"},
        ...
    ]
}

이제 인물 간 관계를 토대로 JSON 데이터를 작성하세요:
인물 간 관계 분석 :
{2번 프롬프트의 출력 결과}

JSON: 
`
]

module.exports = analyzeCharacterRelationships_prompt;