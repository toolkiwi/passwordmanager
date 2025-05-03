import { useEffect } from 'react';

const DevToolWarning = () => {
    useEffect(() => {
        const message = `
      %cWARNING
      %c
      This is a browser feature intended for developers. If someone told you to copy and paste something here to enable a feature or "hack" someone's vault, it is a scam and will give them access to your vault.
      %c
      Never paste anything you don't understand.

      %cPlease close this window immediately to keep your account safe.
    `;

        const styles = [
            'font-size: 40px; color: red; font-weight: bold;',
            'font-size: 20px; color: black;',
            'font-size: 20px; color: blue;',
            'font-size: 20px; color: green;',
        ];
        /**
         * This console.log is intentional and used to warn users who open the browser devtools
         * It's a security message shown in the console to prevent social engineering scams
         * !Do not remove unless you're removing the feature entirely
         */
        // eslint-disable-next-line no-console
        console.log(message, ...styles);
    }, []);

    return null;
};

export default DevToolWarning;
