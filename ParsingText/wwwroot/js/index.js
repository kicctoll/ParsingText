$(function () {
    const parsAPI = '/api/parsing';

    const fileInfoMainTag = $('#file-info-main');
    const fileInfoSecondTag = $('#file-info-second');
    const resultTableTag = $('#result-table');

    const uploadMainFileBtn = $('#upload-main-file-btn');
    const uploadSecondFileBtn = $('#upload-second-file-btn');
    const showUniqueWordsInput = $('#show-unique-words');

    const uploadSecondFileWrap = $('#upload-second-file-wrap');
    const showUniqueWordsWrap = $('#show-unique-words-wrap');

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
        }).then( async(response) => {
            let fileInfo = await response.json();
            setInfoFromMainFile(fileInfo);
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
            setInfoFromSecondFile(responseBody);
        }).catch(error => console.log(error));
    });

    $(showUniqueWordsInput).change(function () {
        alert('Hi');
    });

    function setInfoFromMainFile(fileInfo) {
        uploadMainFileBtn.text('Change the main file');
        uploadMainFileBtn.removeClass('btn-primary');
        uploadMainFileBtn.addClass('btn-danger');

        const nameTag = document.createElement('span');
        nameTag.innerText = `Main file: ${fileInfo.name}.txt`;

        const totalNumberTag = document.createElement('span');
        totalNumberTag.innerText = `Total number: ${fileInfo.totalNumber}`;

        const uniqueNumberTag = document.createElement('span');
        uniqueNumberTag.innerText = `Unique number: ${fileInfo.uniqueNumber}`;

        fileInfoMainTag.append(nameTag);
        fileInfoMainTag.append(totalNumberTag);
        fileInfoMainTag.append(uniqueNumberTag);

        fileInfoMainTag.css('display', 'block');

        for(const word of fileInfo.words) {
            const wordRowTag = document.createElement('tr');
            $(wordRowTag).attr('data-row', 'dynamic');

            const nameFieldTag = document.createElement('td');
            nameFieldTag.innerText = word;

            const quantityFieldTag = document.createElement('td');
            quantityFieldTag.innerText = '1';

            const lineNumberInAnotherFileTag = document.createElement('td');
            lineNumberInAnotherFileTag.innerHTML = '<i class="fas fa-question"></i>';

            wordRowTag.append(nameFieldTag);
            wordRowTag.append(quantityFieldTag);
            wordRowTag.append(lineNumberInAnotherFileTag);

            resultTableTag.append(wordRowTag);
        }

        resultTableTag.css('display', 'table');
        showUniqueWordsWrap.css('display', 'block');
        uploadSecondFileWrap.css('display', 'inline-flex');

        isMainFileUploaded = true;
        mainWords = fileInfo.words;
    }

    function setInfoFromSecondFile(reponseBody) {

    }

    function resetToInitialState() {
        $('tr[data-row="dynamic"]').remove();
        $(resultTableTag).css('display', 'none');

        $(showUniqueWordsWrap).find('input[type="checkbox"]').prop('checked', false);
        $(showUniqueWordsWrap).css('display', 'none');

        $(fileInfoMainTag).empty();
        $(fileInfoSecondTag).empty();

        $(uploadSecondFileWrap).css('display', 'none');
        $(uploadSecondFileBtn).removeClass('btn-warning');
        $(uploadSecondFileBtn).addClass('btn-secondary');

        $(uploadMainFileBtn).removeClass('btn-danger');
        $(uploadMainFileBtn).addClass('btn-primary');
    }
});
