import { Injectable } from '@angular/core';
import parsePhoneNumber from 'libphonenumber-js';

@Injectable({
    providedIn: 'root'
})
export class PhoneNumberService {

    getNationalFormat(phoneNumber: string, countryCode?: any) {
        try {
            const num = parsePhoneNumber(phoneNumber, countryCode);
            return this.formatPhoneNumber(num?.formatNational() as string);
        } catch (e) {
            return this.formatPhoneNumber(phoneNumber);
        }
    }

    getCode(phoneNumber: string) {
        try {
            const num = parsePhoneNumber(phoneNumber);
            return `+${num?.countryCallingCode}`;
        } catch (e) {
            return '';
        }
    }

    getInternationalFormat(phoneNumber: string, countryCode?: any) {
        try {
            const num = parsePhoneNumber(phoneNumber, countryCode);
            return num?.formatInternational();
        } catch (e) {
            return phoneNumber;
        }
    }

    getURIFormat(phoneNumber: string, countryCode?: any) {
        try {
            const num = parsePhoneNumber(phoneNumber, countryCode);
            return num?.getURI();
        } catch (e) {
            return phoneNumber;
        }
    }

    formatPhoneNumber(value: string): string {
        if (!value) {
            return '';
        }

        // Remove non-digit characters
        const cleaned = value.replace(/\D/g, '');

        // Match 10 or 11-digit phone numbers
        if (cleaned.length <= 11) {
            if (cleaned.length === 11) {
                // 11-digit number (assume first digit is the country code or leading digit)
                return `${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
            } else if (cleaned.length === 10) {
                // Standard 10-digit format
                return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
            } else if (cleaned.length >= 7) {
                // Format when at least 7 digits are available
                return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
            } else if (cleaned.length >= 4) {
                // Format when at least 4 digits are available
                return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
            } else {
                // Format when less than 4 digits are available
                return `(${cleaned}`;
            }
        }

        return value; // Return unformatted value if it exceeds 11 digits
    }
}
