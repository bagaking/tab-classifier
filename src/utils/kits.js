export class Kits {

    GetClipboard() { 
        const input = document.createElement('TEXTAREA');
        input.style.type = 'textarea';
        input.style.position = 'fixed';
        input.style.opacity = 0; 
        document.body.appendChild(input);
        input.select();
        document.execCommand('Paste');
        let text = input.value
        document.body.removeChild(input);
        return text
    }

    SetClipboard(text) { 
        const input = document.createElement('TEXTAREA'); 
        input.style.position = 'fixed';
        input.style.opacity = 0;
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('Copy');
        document.body.removeChild(input); 
        console.log(input.value)
        console.log(input.innerText)
    }
}