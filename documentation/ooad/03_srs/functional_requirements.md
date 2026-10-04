# Functional Requirements

## Authentication & Authorization
* **FR-01**: The system shall allow users to register as either a `student` or `reviewer`. Admin accounts are predefined.
* **FR-02**: The system shall restrict access based on roles (Admin, Reviewer, Student).

## Event & Criteria Management
* **FR-03**: The Admin shall be able to create events specifying title, dates, and a dynamic list of evaluation criteria.
* **FR-04**: The system shall store these criteria in a JSON format linked to the specific event.

## Poster Submission
* **FR-05**: Students shall be able to submit posters to active events.
* **FR-06**: Students shall be able to list co-authors during submission.

## Reviewer Assignment
* **FR-07**: The Admin shall be able to assign one or multiple reviewers to a single poster.
* **FR-08**: The Admin shall be able to bulk-assign multiple reviewers to all posters within a specific event using a checkbox modal.

## Evaluation Engine
* **FR-09**: Reviewers shall see a list of their assigned posters.
* **FR-10**: The evaluation form shall dynamically render input fields (0-10) matching the exact criteria defined by the Admin for that event.
* **FR-11**: The system shall compute the `total_score` as the sum of all individual criterion scores.

## Ranking & Leaderboard
* **FR-12**: The Admin shall be able to trigger a "Calculate Ranks" function.
* **FR-13**: The system shall calculate the average score for each poster based on all completed evaluations.
* **FR-14**: The system shall sort posters by average score and assign sequential ranks, resolving ties by assigning the same rank to identical scores.
* **FR-15**: The system shall display the final results on a formatted Leaderboard UI.
