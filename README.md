## Node Conference - Week1 HW

### 설계:
- 요리 하나하나를 객체로 인식하는 것이 편리할 것이라 생각해 객체지향으로 설계했습니다.
- 요리사와 홀알바가 한 명씩이고, 하나의 작업만을 처리할 수 있으므로 각각의 큐를 주었습니다.
- 각 객체의 요리/서빙이 종료되면 `EventEmitter`를 호출해 각 큐를 진행시킵니다.

### 결과:
![image](https://github.com/LikeLion-at-CAU-11th/node-conference-week1/assets/106161726/e0e4a9cd-205a-4a59-bf7c-fff9232c92ba)
