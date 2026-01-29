const express = require('express');
const router = express.Router();
const { createIssue, getIssues, getIssueById, updateIssueStatus, getForwardCandidates } = require('../controllers/issueController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('student'), createIssue)
    .get(protect, getIssues);

router.route('/forward-candidates')
    .get(protect, getForwardCandidates);

router.route('/:id')
    .get(protect, getIssueById);

router.route('/:id/status')
    .put(protect, authorize('student', 'faculty', 'hod', 'dean', 'principal', 'admin', 'warden', 'transport_incharge'), updateIssueStatus);

module.exports = router;
