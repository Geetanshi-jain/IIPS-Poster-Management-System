# Software Design Document

## 1. Architecture Overview
The system follows a strict Layered Architecture:
* **Presentation Layer**: React.js with Tailwind CSS, utilizing Axios for HTTP communication.
* **Application Layer**: Django REST Framework (DRF) handling routing, authorization, and function-based views (FBVs).
* **Data Access Layer**: Django ORM interacting with an SQLite database (PostgreSQL ready).

## 2. Core Modules
1. **Authentication**: Handled via Django sessions/tokens. 
2. **Event & Criteria Module**: Stores events and their dynamic JSON criteria.
3. **Assignment Engine**: Allows bulk mapping of `Reviewer` to `Poster`.
4. **Evaluation Module**: Dynamically parses the event's `criteria_list` to generate form inputs, then saves the result in `criteria_scores` JSON in the Evaluation model.
5. **Ranking Algorithm**: A backend utility that fetches all `ReviewAssignment` objects for an evaluated poster, averages their `total_score`, and assigns competition-style ranks.

## 3. Ranking Policy
* Calculate Average = sum(eval.total_score) / count(evaluations)
* Sort posters descending by average score.
* Handle ties: If `Poster A` and `Poster B` have the exact same average, they receive the same rank number.

## 4. API Inventory (Key Endpoints)
* `POST /api/register/` - User registration
* `POST /api/events/` - Event creation
* `POST /api/posters/` - Poster submission
* `POST /api/reviewers/bulk-assign/` - Assign reviewers
* `POST /api/evaluations/submit/` - Save scores
* `GET /api/events/{id}/rankings/` - Fetch leaderboard
