# Data Dictionary

## Table: User
* `id` (PK)
* `username` (String, Unique)
* `email` (String)
* `role` (Enum: admin, reviewer, student)

## Table: Event
* `id` (PK)
* `title` (String)
* `start_date` (Date)
* `end_date` (Date)
* `criteria_list` (JSON) - Stores dynamic criteria strings.
* `results_published` (Boolean)

## Table: Poster
* `id` (PK)
* `title` (String)
* `abstract` (Text)
* `status` (String: DRAFT, SUBMITTED, UNDER_REVIEW, EVALUATED)
* `event_id` (FK to Event)

## Table: ReviewAssignment
* `id` (PK)
* `poster_id` (FK to Poster)
* `reviewer_id` (FK to User)

## Table: Evaluation
* `id` (PK)
* `assignment_id` (FK to ReviewAssignment, Unique/OneToOne)
* `total_score` (Float)
* `criteria_scores` (JSON) - Stores key-value pairs of criteria to scores.
* `comments` (Text)
