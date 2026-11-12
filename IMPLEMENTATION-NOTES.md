# Placement Assessment — Implementation Notes

## Delivered in this overlay
- Replacement `placement-test.html` compatible with the current static site shell.
- New isolated stylesheet `placement-assessment.css`.
- New isolated front-end script `placement-assessment.js`.
- 40 multiple-choice questions split into Listening, Reading, Grammar, and Vocabulary & Usage.
- Writing task and microphone recording / audio-file selection.
- Per-section objective score report.
- Local draft save and JSON export.
- Print-friendly preliminary report (browser print / Save as PDF).

## Explicitly not delivered
- No backend, database, authentication, reviewer dashboard, automatic upload, certificate issuance, or QR verification.
- No final CEFR level assignment or score boundaries.
- No official / internationally accredited credential.
- No final professional audio recordings.
- No automatic retake lockout; the waiting period remains a project decision.

## Release blockers
1. Server-side question delivery and scoring: client-side answer keys are inspectable.
2. Secure persistence and media upload with consent and retention controls.
3. Reviewer workflow, rubric calibration, audit trail, and final approval.
4. Standard setting / piloting to determine defensible level boundaries.
5. Certificate registry and verification endpoint.
6. Replace synthetic browser speech with controlled audio assets.

This is a preview of the learner-facing flow only. Do not represent it as a production assessment until release blockers have been addressed.
