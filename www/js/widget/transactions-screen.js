class TransactionsScreen {
    static createCompletedPaymentItem(fiatAmount, bchAmountSatoshis, timestamp) {
        const template = TransactionsScreen.paymentItemTemplate;
        const widget = template.cloneNode(true);

        const fiatAmountElement = widget.querySelector(".amount-fiat");
        const bchAmountElement = widget.querySelector(".amount-bch");
        const timestampElement = widget.querySelector(".timestamp");

        const bchAmount = Util.fromSatoshis(bchAmountSatoshis);
        const paymentAmounts = App.formatFiatAmount(fiatAmount, bchAmount);

        fiatAmountElement.textContent = "$" + paymentAmounts.fiat;
        bchAmountElement.textContent = paymentAmounts.bch + " BCH";
        timestampElement.textContent = (new Date(timestamp * 1000)).toLocaleString();

        return widget;
    }

    static create() {
        const template = TransactionsScreen.template;
        const widget = template.cloneNode(true);

        const completedPaymentsListElement = widget.querySelector(".completed-payments-list");

        // Back Button
        const navigationContainer = widget.querySelector(".navigation-container");
        navigationContainer.onclick = function() {
            const checkoutScreen = CheckoutScreen.create();
            App.setScreen(checkoutScreen);
        };

        const completedPayments = App.getCompletedPayments();
        if (completedPayments.length == 0) {
            completedPaymentsListElement.textContent = "No transactions.";
        }
        else {
            for (let i = 0; i < completedPayments.length; i += 1) {
                const completedPayment = completedPayments[i];
                const itemElement = TransactionsScreen.createCompletedPaymentItem(completedPayment.fiatAmount, completedPayment.amount, completedPayment.timeCompleted);
                completedPaymentsListElement.appendChild(itemElement);
            }
        }

        return widget;
    }
}

App.addOnLoad(function() {
    const templates = document.getElementById("templates");
    TransactionsScreen.template = templates.querySelector(".transactions-screen");
    TransactionsScreen.paymentItemTemplate = templates.querySelector(".completed-payment-item");
});
