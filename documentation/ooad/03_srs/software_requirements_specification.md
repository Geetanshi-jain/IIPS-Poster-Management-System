# Software Requirements Specification (SRS)

## 1. Introduction
The IIPS Student Poster Submission, Evaluation & Research Ranking System manages research poster events, student registrations, submissions, reviews, and event-specific rankings.

## 2. Functional Requirements
- **FR-001**: The system shall allow administrators to create and publish events.
- **FR-002**: Students shall be able to register for published events.
- **FR-003**: Students shall be able to submit poster details (title, abstract, authors, file url).
- **FR-004**: Administrators shall assign reviewers to posters.
- **FR-005**: Reviewers shall evaluate posters based on predefined rubric criteria.
- **FR-006**: The system shall calculate the total score for each poster based on evaluations.
- **FR-007**: The system shall generate event rankings based on total scores.

## 3. Non-Functional Requirements
- **NFR-001**: The system shall provide secure authentication via JWT.
- **NFR-002**: The API shall respond within 500ms for standard requests.
- **NFR-003**: The architecture shall separate frontend (React) and backend (Django) concerns.

## 4. Business Rules
- **BR-001**: A poster can only be evaluated if its status is 'UNDER_REVIEW'.
- **BR-002**: Rankings are calculated separately for each individual event.
