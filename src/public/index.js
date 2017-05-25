$(document).ready(() => {
	let files;
	$('input#picture').on('change', e => {
		files = e.target.files;
	});
	$('button#sendImage').click(() => {
		let data = new FormData();
		$.each(files, (k, v) => {
			data.append(k, v);
		});
		$.ajax('/clients/345cae88b2a70130c996b44491004ad2/picture', {
			cache: false,
			data: data,
			dataType: 'json',
			processData: false,
			contentType: false,
			method: 'POST',
			success: (result, status, xhr) => {
				alert("got result " + JSON.stringify(result));
			},
			error: (xhr, status, err) => {
				alert("got error " + JSON.stringify(err));
			}
		});
	});
	$('button#sendProduct').click(() => {
		let name = $('input#name').val();
		let description = $('input#description').val();
		let stock = parseInt($('input#stock').val());
		let price = parseInt($('input#price').val());
		$.ajax('/products/add', {
			cache: false,
			data: {
				name: name,
				description: description,
				stock: stock,
				price: price,
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
