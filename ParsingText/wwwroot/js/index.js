$(function () {
    const parsAPI = '/api/parsing';

    $('#file').click(function () {
        this.value = null;
    });

    $('#file').change(async function () {
        const requiredFile = this.files[0];
        const formData = new FormData();
        formData.append("File", requiredFile);

        await fetch(`${parsAPI}/upload/main-file`, {
            body: formData,
            method: 'Post'
        }).then( async(response) => {
            let value = await response.json();
            console.log(value);
        }).catch(error => console.log(error));
    });
});
