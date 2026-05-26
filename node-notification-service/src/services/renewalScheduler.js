const cron = require("node-cron");

const { sendNotification } =
require("./notificationService");

const EVENTS =
require("../events/notificationEvents");

const startRenewalScheduler = () => {

    /*
        Every 30 seconds for testing
        Later change to real schedule
    */

    cron.schedule("*/30 * * * * *", () => {

        console.log("[CRON] Checking policy renewals...");

        const payload = {
            type: "POLICY_RENEWAL_DUE",
            title: "Policy Renewal Reminder",
            message: "Your insurance policy expires in 7 days",
            policyId: "POL101",
            renewalDate: "2026-06-02",
            timestamp: new Date()
        };

        sendNotification(
            "customer_12",
            EVENTS.POLICY_RENEWAL_DUE,
            payload
        );

    });

};

module.exports = startRenewalScheduler;