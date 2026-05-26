const express = require("express");

const router = express.Router();

const EVENTS = require("../events/notificationEvents");

const {
    sendNotification
} = require("../services/notificationService");



/*
=========================================
1. CLAIM FILED
=========================================
*/

router.post("/claim-filed", (req, res) => {

    const payload = {
        type: "CLAIM_FILED",
        title: "New Claim Filed",
        message: req.body.message,
        claimId: req.body.claimId,
        timestamp: new Date()
    };

    sendNotification(
        "claims_manager",
        EVENTS.CLAIM_FILED,
        payload
    );

    res.status(200).json({
        success: true,
        message: "Claim filed notification sent"
    });

});



/*
=========================================
2. CLAIM STATUS UPDATED
=========================================
*/

router.post("/claim-status-updated", (req, res) => {

    const payload = {
        type: "CLAIM_STATUS_UPDATED",
        title: "Claim Status Updated",
        message: req.body.message,
        claimId: req.body.claimId,
        status: req.body.status,
        timestamp: new Date()
    };

    sendNotification(
        req.body.targetRoom,
        EVENTS.CLAIM_STATUS_UPDATED,
        payload
    );

    res.status(200).json({
        success: true,
        message: "Claim status notification sent"
    });

});



/*
=========================================
3. FRAUD SCORE GENERATED
=========================================
*/

router.post("/fraud-score", (req, res) => {

    const payload = {
        type: "FRAUD_SCORE_GENERATED",
        title: "Fraud Risk Alert",
        message: req.body.message,
        claimId: req.body.claimId,
        fraudProbability: req.body.fraudProbability,
        riskLevel: req.body.riskLevel,
        timestamp: new Date()
    };

    sendNotification(
        "claims_manager",
        EVENTS.FRAUD_SCORE_GENERATED,
        payload
    );

    res.status(200).json({
        success: true,
        message: "Fraud alert notification sent"
    });

});



/*
=========================================
4. POLICY RENEWAL DUE
=========================================
*/

router.post("/policy-renewal", (req, res) => {

    const payload = {
        type: "POLICY_RENEWAL_DUE",
        title: "Policy Renewal Reminder",
        message: req.body.message,
        policyId: req.body.policyId,
        renewalDate: req.body.renewalDate,
        timestamp: new Date()
    };

    sendNotification(
        req.body.targetRoom,
        EVENTS.POLICY_RENEWAL_DUE,
        payload
    );

    res.status(200).json({
        success: true,
        message: "Policy renewal notification sent"
    });

});



/*
=========================================
5. PREMIUM PAYMENT RECEIVED
=========================================
*/

router.post("/payment-received", (req, res) => {

    const payload = {
        type: "PREMIUM_PAYMENT_RECEIVED",
        title: "Payment Received",
        message: req.body.message,
        paymentId: req.body.paymentId,
        amount: req.body.amount,
        timestamp: new Date()
    };

    sendNotification(
        req.body.targetRoom,
        EVENTS.PREMIUM_PAYMENT_RECEIVED,
        payload
    );

    res.status(200).json({
        success: true,
        message: "Payment notification sent"
    });

});



/*
=========================================
6. CLAIM SETTLED
=========================================
*/

router.post("/claim-settled", (req, res) => {

    const payload = {
        type: "CLAIM_SETTLED",
        title: "Claim Settled",
        message: req.body.message,
        claimId: req.body.claimId,
        settlementAmount: req.body.settlementAmount,
        timestamp: new Date()
    };

    sendNotification(
        req.body.targetRoom,
        EVENTS.CLAIM_SETTLED,
        payload
    );

    res.status(200).json({
        success: true,
        message: "Claim settlement notification sent"
    });

});



module.exports = router;