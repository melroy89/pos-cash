window.MAX_SAFE_INTEGER = window.Number.MAX_SAFE_INTEGER || 9007199254740991;

class Util {
    static cancelEvent(event) {
        if (! event.preventDefault) {
            event.returnValue = false;
            return;
        }
        event.preventDefault();
    }

    static getDecimalSeparator() {
        const formatOptions = { maximumFractionDigits: 2, minimumFractionDigits: 2 };
        const number = 0.12;
        const floatString = number.toLocaleString(undefined, formatOptions);
        return floatString.charAt(1);
    }

    static getThousandsSeparator() {
        const decimalSeparator = Util.getDecimalSeparator();
        return (decimalSeparator == "." ? "," : ".");
    }

    static isMobile() {
        const matchers = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
        return matchers.some(function(item) {
            return navigator.userAgent.match(item);
        });
    }
}

Util.KeyCodes = {};
Util.KeyCodes.escape = 27;
Util.KeyCodes.delete = 8;
Util.KeyCodes.tab = 9;
Util.KeyCodes.enter = 13;
Util.KeyCodes.shift = 16;

class App {
    static setScreen(screen) {
        const main = document.getElementById("main");
        while (main.firstChild) {
            const widget = main.firstChild;
            if (typeof widget.unload == "function") {
                widget.unload();
            }
            main.removeChild(widget);
        }

        if (screen) {
            main.appendChild(screen);
        }
    }

    static setPin(value) {
        const localStorage = window.localStorage;
        localStorage.setItem("pin", value);
    }

    static getPin() {
        const localStorage = window.localStorage;

        const pin = localStorage.getItem("pin");
        if (pin == null) { return ""; }

        return pin;
    }

    static setMerchantName(value) {
        const localStorage = window.localStorage;
        localStorage.setItem("merchantName", value);
    }

    static getMerchantName() {
        const localStorage = window.localStorage;

        const merchantName = localStorage.getItem("merchantName");
        if (merchantName == null) { return "..."; }

        return merchantName;
    }

    static setDestinationAddress(value) {
        const localStorage = window.localStorage;
        localStorage.setItem("destinationAddress", value);
    }

    static getDestinationAddress() {
        const localStorage = window.localStorage;
        return localStorage.getItem("destinationAddress");
    }

    static setCountry(value) {
        const localStorage = window.localStorage;
        return localStorage.setItem("country", value);
    }

    static getCountry() {
        const localStorage = window.localStorage;
        return localStorage.getItem("country") || "US";
    }

    static getCountryData(countryIso) {
        for (let i = 0; i < App.countries.length; i += 1) {
            const country = App.countries[i];
            if (country.iso == countryIso) {
                return country;
            }
        }
        return null;
    }

    static isMultiTerminalEnabled() {
        const localStorage = window.localStorage;
        const isEnabled = localStorage.getItem("multiTerminalIsEnabled");

        if (isEnabled == null) { return false; }
        return (isEnabled ? true : false);
    }

    static setMultiTerminalIsEnabled(isEnabled) {
        const localStorage = window.localStorage;
        return localStorage.setItem("multiTerminalIsEnabled", (isEnabled ? true : false));
    }

    static isAddressValid(addressString) {
        const isValidResult = function(result) {
            return (result && typeof result != "string");
        };

        let result = window.libauth.decodeBase58Address(App.sha256, addressString);
        if (isValidResult(result)) { return true; }

        result = window.libauth.decodeCashAddressFormat(addressString);
        if (isValidResult(result)) { return true; }

        result = window.libauth.decodeCashAddressFormat("bitcoincash:" + addressString);
        if (isValidResult(result)) { return true; }

        return false;
    }

    static updateExchangeRate() {
        Http.get("https://markets.api.bitcoin.com/rates", {"c": "BCH"}, function(data) {
            if ( (! data) || (data.length == 0) ) { return; }

            App.exchangeRateData = data;
            App.exchangeRateAge = Date.now();
        });
    }

    static getExchangeRate() {
        if (! App.exchangeRateData) { return null; }

        const countryIso = App.getCountry();
        const country = App.getCountryData(countryIso);
        const currency = country.currency;

        for (let i = 0; i < App.exchangeRateData.length; i += 1) {
            const exchangeData = App.exchangeRateData[i];
            if (exchangeData.code == currency) {
                return exchangeData.rate;
            }
        }

        return null;
    }

    static getExchangeRateAge() {
        return App.exchangeRateAge;
    }
}
