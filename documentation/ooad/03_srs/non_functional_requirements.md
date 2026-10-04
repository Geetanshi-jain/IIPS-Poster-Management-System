# Non-Functional Requirements

* **NFR-01 (Performance)**: The system API should respond to typical requests in under 500ms.
* **NFR-02 (Scalability)**: The database schema (SQLite scaling to PostgreSQL) must support thousands of concurrent students and evaluations.
* **NFR-03 (Usability)**: The UI must be responsive, built with Tailwind CSS, ensuring usability on both desktop and tablet devices.
* **NFR-04 (Security)**: All API endpoints must be protected via Django REST Framework JWT or Session authentication. Cross-Origin Resource Sharing (CORS) must be strictly configured.
* **NFR-05 (Reliability)**: Evaluation calculations use backend validation to ensure floating-point precision and prevent malicious input scores (e.g. exceeding maximum bounds).
