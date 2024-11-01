# Yaksok 

Yaksok은 친구나 가족과의 약속을 손쉽게 잡고 일정을 조율할 수 있도록 도와주는 웹 애플리케이션입니다. 사용자는 날짜와 장소를 선택하고, 투표 과정을 통해 최종 결정을 내리며, 모든 과정이 하나의 플랫폼에서 관리됩니다.

<br>

## 💻 프로젝트 소개

**배포 링크**: [Yaksok](https://yaksok-plans.vercel.app/)

**프로젝트 기간**: 2024.08.01 ~ 진행중

<br>

## 📌 주요 기능

- **일정 생성 및 참여자 응답**:
   - 주최자는 새로운 약속 일정을 생성하고, 모임에 초대된 참여자들은 자신이 가능한 날짜와 위치를 선택하여 응답을 제출

- **투표 시스템을 통한 최적 일정 조율**:
   - 모든 참여자들의 응답이 모이면 가장 겹치는 날짜와 장소에 대해 투표 진행
   - 투표는 다수결 방식으로 진행되며, 이를 통해 최적의 약속 일정이 결정

- **실시간 데이터 업데이트**:
   - Supabase를 사용하여 실시간으로 데이터를 업데이트
   - 참여자들이 일정 선택 또는 투표를 진행할 때마다 결과가 즉시 반영되어 최신 상태가 유지

- **반응형 디자인 및 사용자 친화적 인터페이스**:
   - 모바일 환경에서도 사용이 편리하도록 반응형 UI 적용
   - 다양한 기기에서 일관된 사용자 경험을 제공

- **최종 일정 및 장소 확인**:
   - 모든 투표가 완료되면 최종 확정된 날짜와 장소가 표시
   - 참여자들은 메인 페이지에서 약속 상세 확인 가능

<br>

## 🛠️ 개발 스택

- **언어**: TypeScript
- **빌드**: Next.js
- **호스팅**: Vercel
- **패키지 매니저**: npm
- **라이브러리**
  - **라우팅**: Next.js 내장 라우팅
  - **CSS 스타일링**: Tailwind CSS
  - **인증**: NextAuth (사용자 로그인/세션 관리)
- **데이터베이스**: Supabase (실시간 데이터 관리 및 사용자 데이터 저장)

<br>

## 🎨 기획 및 디자인

- **기획 및 스타일 가이드 작성**: 각 페이지의 레이아웃과 흐름을 기획하고, 와이어프레임을 작성하여 기능 구조를 설계하였습니다.
- **UI/UX 디자인**: Figma를 활용하여 인터랙티브 프로토타입을 작성하고 사용자 경험을 시각화하며 인터랙션 설계를 구체화하였습니다.

<br>

<img src="https://github.com/user-attachments/assets/f1e5ae71-b842-45dc-be52-11e00727432e" width="600" alt="기획 및 디자인 이미지"/>

<br>

## 🌟 프로젝트 예시 화면

<table>
   <tr>
      <td align="center"><strong>참여자 응답 페이지</strong></td>
      <td align="center"><strong>일정 조율 페이지</strong></td>
      <td align="center"><strong>메인 페이지</strong></td>
      <td align="center"><strong>일정 상세 페이지</strong></td>
   </tr>
   <tr>
      <td align="center"><img src="https://github.com/user-attachments/assets/f6fa3c90-cda0-4dad-9196-a1b5187f424c" width="200" height="450" alt="참여자 응답 페이지"/></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/eaf0e14b-8fc2-49c4-a4aa-313744a4529f" width="200" height="450" alt="일정 조율 페이지"/></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/a6b2f87c-2056-4fe9-b2e3-c46496482997" width="200" height="450" alt="메인 페이지"/></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/85ce25ff-1b77-4fe9-946b-c072fefada1d" width="200" height="450" alt="일정 상세 페이지"/></td>
   </tr>
</table>

<br>

## 📌 기능 구현

<table>
   <tr>
      <th align="left">페이지</th>
      <th align="left">설명</th>
   </tr>
   <tr>
      <td align="left"><strong>로그인</strong></td>
      <td align="left">사용자가 로그인하여 메인페이지에 접근</td>
   </tr>
   <tr>
      <td align="left"><strong>회원가입</strong></td>
      <td align="left">새로운 사용자는 회원가입을 통해 계정 생성</td>
   </tr>
   <tr>
      <td align="left"><strong>메인 페이지</strong></td>
      <td align="left">초대받은 약속, 진행 중인 약속, 다가오는 약속을 한눈에 확인 가능</td>
   </tr>
   <tr>
      <td align="left"><strong>일정 생성</strong></td>
      <td align="left">주최자는 새로운 일정을 생성하고 참여자들을 초대</td>
   </tr>
   <tr>
      <td align="left"><strong>참여자 응답</strong></td>
      <td align="left">초대받은 참여자들은 가능 날짜와 장소를 선택하여 응답 제출</td>
   </tr>
   <tr>
      <td align="left"><strong>일정 조율 및 투표 기능</strong></td>
      <td align="left">참여자들의 응답을 바탕으로 최적의 날짜와 장소에 대해 투표 진행</td>
   </tr>
   <tr>
      <td align="left"><strong>장소 검색</strong></td>
      <td align="left">참여자들은 장소를 검색하여 약속에 적합한 위치 찾기</td>
   </tr>
   <tr>
      <td align="left"><strong>장소 저장</strong></td>
      <td align="left">마음에 드는 장소는 저장하여 하트 탭에서 확인 가능</td>
   </tr>
   <tr>
      <td align="left"><strong>장소 투표</strong></td>
      <td align="left">모든 참여자가 투표에 참여하여 최적의 장소 결정</td>
   </tr>
   <tr>
      <td align="left"><strong>최종 장소 확정</strong></td>
      <td align="left">투표가 완료된 후 최종 확정된 장소 표시</td>
   </tr>
   <tr>
      <td align="left"><strong>대기 페이지</strong></td>
      <td align="left">모든 참여자 응답을 기다리는 대기 페이지</td>
   </tr>
   <tr>
      <td align="left"><strong>로딩 페이지</strong></td>
      <td align="left">페이지 전환 시 보여지는 로딩 페이지</td>
   </tr>
</table>

<br>

## 🔄 향후 개선 사항

- **일정 리마인더 기능**: 일정 당일 또는 전날 사용자에게 알림을 제공하여 참여를 독려
- **마이페이지**: 친구 추가, 일정 관리 등 개인화된 관리 기능 추가
- **다국어 지원**: 글로벌 사용자들을 위한 다국어 인터페이스 지원
- **카카오 로그인**: 현재 이슈가 있는 카카오 로그인 기능 해결 및 통합
