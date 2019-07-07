$(function () {
    const parsAPI = '/api/parsing';

    const fileInfoMainTag = $('#file-info-main');
    const fileInfoSecondTag = $('#file-info-second');
    const resultTableTag = $('#result-table');

    const uploadMainFileBtn = $('#upload-main-file-btn');
    const uploadSecondFileBtn = $('#upload-second-file-btn');

    const uploadSecondFileWrap = $('#upload-second-file-wrap');

    let mainWords = [];

    let isMainFileUploaded = false;
    let isSecondFileUploaded = false;
    let isUniqueWordsShown = false;

    $('#main-file').click(function (event) {
        if (isMainFileUploaded) {
            const isContinue = confirm('Tha previous data will be lose. Are you sure you want to continue?');
            if (!isContinue) {
                event.preventDefault();
            } else {
                resetToInitialState();
            }
        }
        this.value = null;
    });

    $('#main-file').change(async function () {
        const requiredFile = this.files[0];
        const formData = new FormData();
        formData.append("File", requiredFile);

        await fetch(`${parsAPI}/upload/main-file`, {
            body: formData,
            method: 'Post'
        }).then(async (response) => {
            let fileInfo = await response.json();
            response.status === 200 ? setInfoFromMainFile(fileInfo) : alert(fileInfo);
        }).catch(error => console.log(error));
    });

    $('#second-file').click(function () {
        this.value = null;
    });

    $('#second-file').change(async function () {
        const requiredFile = this.files[0];
        const formData = new FormData();

        formData.append("File", requiredFile);
        formData.append("TextFromMainWords", mainWords);
        formData.append("isUnique", isUniqueWordsShown.toString());

        await fetch(`${parsAPI}/upload/second-file`, {
            body: formData,
            method: 'Post'
        }).then(async response => {
            let responseBody = await response.json();
            response.status === 200 ? setInfoFromSecondFile(responseBody) : alert(responseBody);
        }).catch(error => console.log(error));
    });

    function setInfoFromMainFile(fileInfo) {
        uploadMainFileBtn.text('Change the main file');
        uploadMainFileBtn.removeClass('btn-primary');
        uploadMainFileBtn.addClass('btn-danger');

        const nameTag = document.createElement('span');
        nameTag.innerText = `Main file: ${fileInfo.name}`;

        const totalNumberTag = document.createElement('span');
        totalNumberTag.innerText = `Total number: ${fileInfo.totalNumber}`;

        const uniqueNumberTag = document.createElement('span');
        uniqueNumberTag.innerText = `Unique number: ${fileInfo.uniqueNumber}`;

        fileInfoMainTag.append(nameTag);
        fileInfoMainTag.append(totalNumberTag);
        fileInfoMainTag.append(uniqueNumberTag);

        fileInfoMainTag.css('display', 'block');

        for (let i = 0; i < fileInfo.words.length; i++) {
            const wordRowTag = document.createElement('tr');
            $(wordRowTag).attr('data-row', 'dynamic');

            const nameFieldTag = document.createElement('td');
            nameFieldTag.innerText = fileInfo.words[i];

            const quantityFieldTag = document.createElement('td');
            $(quantityFieldTag).attr('data-row-column', 'quantity');
            quantityFieldTag.innerText = fileInfo.quantities[i];

            const lineNumberInAnotherFileTag = document.createElement('td');
            $(lineNumberInAnotherFileTag).attr('data-row-column', 'lineNumbers');
            lineNumberInAnotherFileTag.innerHTML = '<i class="fas fa-question"></i>';

            wordRowTag.append(nameFieldTag);
            wordRowTag.append(quantityFieldTag);
            wordRowTag.append(lineNumberInAnotherFileTag);

            resultTableTag.append(wordRowTag);
        }

        resultTableTag.css('display', 'table');
        uploadSecondFileWrap.css('display', 'inline-flex');

        isMainFileUploaded = true;
        mainWords = fileInfo.words;
    }

    function setInfoFromSecondFile(responseBody) {
        console.log(responseBody);

        if (isSecondFileUploaded) {
            fileInfoSecondTag.empty();
        }
        const fileNameTag = document.createElement('span');
        fileNameTag.innerText = `Second file: ${responseBody.fileName}`;

        fileInfoSecondTag.append(fileNameTag);
        $(fileInfoSecondTag).css('display', 'block');

        const lineNumbersFields = $('td[data-row-column="lineNumbers"]');
        const lineNumbers = responseBody.lineNumbers;
        for (let i = 0; i < lineNumbers.length; i++) {
            const item = lineNumbersFields.get(i);
            item.innerText = lineNumbers[i].substring(0, lineNumbers[i].length - 2);
        }

        $(uploadSecondFileBtn).removeClass('btn-secondary');
        $(uploadSecondFileBtn).addClass('btn-warning');
        $(uploadSecondFileBtn).text('Change the secondary file');

        isSecondFileUploaded = true;
    }

    function resetToInitialState() {
        $('tr[data-row="dynamic"]').remove();
        $(resultTableTag).css('display', 'none');

        $(fileInfoMainTag).empty();
        $(fileInfoSecondTag).empty();

        $(uploadSecondFileWrap).css('display', 'none');
        $(uploadSecondFileBtn).removeClass('btn-warning');
        $(uploadSecondFileBtn).addClass('btn-secondary');
        $(uploadSecondFileBtn).text('Upload the secondary file');

        $(uploadMainFileBtn).removeClass('btn-danger');
        $(uploadMainFileBtn).addClass('btn-primary');
    }
});
