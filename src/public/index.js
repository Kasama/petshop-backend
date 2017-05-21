$(document).ready(() => {
	$('button#send').click(() => {
		let name = $('input#name').val();
		let age = $('input#age').val();
		$.ajax('/clients/add', {
			cache: false,
			data: {
				name: name,
				age: age,
			},
			success: (result, status, xhr) => {
				alert("Got result " + JSON.stringify(result));
			},
			error: (xhr, status, error) => {
				alert("Got error " + JSON.stringify(error));
			},
			method: 'POST',
		});
	});
});
