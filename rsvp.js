$(document).ready(function() {
    $("#btn_message").on("click", function (e) {
        e.preventDefault();
        if($("#guest_name").val() === ''){
            return alert('Nama Harus Diisi')
        }
        if($("#message").val() === ''){
            return alert('Pesan Harus Diisi');
        }
        if($("#guest_name").val() !== '' && $("#message").val()!== '') {
            $(this).html('Mengirim Pesan...');
            var btn = $(this);
            btn.attr("disabled", "disabled");
            setTimeout(function () {
                $('#form_message').submit();
            }, 1500);
        }
    });

    $('#form_message').on('submit', function(event){
        event.preventDefault();
        var btn = $("#btn_message");
        var token = $('meta[name="csrf-token"]').attr('content');

        $.ajax({
            url:'/message/submit',
            method:"POST",
            headers: {
                'X-CSRF-TOKEN': token,
            },
            async:true,
            data:new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success:function(response)
            {
                console.log(response);
                var text = '';
                var res = JSON.parse(response);
                if(res.status) {
                    btn.html('<small>Terima kasih atas doa dan ucapannya</small>');
                    setTimeout(function(){
                        btn.html('Kirim');
                    }, 3000);
                    $("#message_list").prepend('<li>\n' +
                        '                        <span class="from">'+$('#guest_name').val()+'</span>\n' +
                        '                        <span class="guest_message">'+$('#message').val()+'</span>\n' +
                        '                    </li>');
                    $('#guest_name').val('');
                    $('#message').val('');
                }else{

                }
            }
        })
    });
});

$(document).on("click","#btn_submit_confirm", function (e) {
    e.preventDefault();
    let invitation_code = $("#invitation_code").val();
    let sender_name = $("#sender_name").val();
    let gift_id = $("#gift_id").val();
    let gift_product_id = $("#gift_product_id").val();
    let resi_number = $("#resi_number").val();
    let notes = $("#gift_product_notes").val();
    let total = $("#total").val();
    let guest_id = $("#guest_id").val();
    let type = $('input:radio[name="gift_type"]:checked').val();

    if(type==='digital'){
        if(sender_name === ''){
            alert('Nama Pengirim Harus Diisi');
            return;
        }
        if(gift_id === ''){
            alert('Tujuan pengiriman Harus Diisi');
            return;
        }
        if(total === ''){
            alert('Jumlah yang dikirim Harus Diisi');
            return;
        }
    }else{
        sender_name = $("#sender_name_product").val();
        if(sender_name === ''){
            alert('Nama Pengirim Harus Diisi');
            return;
        }
        if(gift_product_id === ''){
            alert('Produk Harus Diisi');
            return;
        }
    }

    let btn = $(this);
    btn.html('Mengirim ...');
    btn.addClass('disabled');

    var token = $('meta[name="csrf-token"]').attr('content');
    $.ajax({
        url:'/gift-confimation/submit',
        method:"POST",
        headers: {
            'X-CSRF-TOKEN': token
        },
        data: {
            gift_type : type,
            invitation_code:invitation_code,
            sender_name:sender_name,
            gift_id:gift_id,
            total:total,
            guest_id:guest_id,
            gift_product_id : gift_product_id,
            resi_number : resi_number,
            notes : notes
        },
        success:function(response)
        {
            var text = '';
            var res = JSON.parse(response);
            if(res.status) {
                btn.html('Kirim');
                btn.removeClass('disabled');
                $("#btn_cancel_confirm").click();
                $("#total").val('');
                $("#resi_number").val('');
                $("#gift_product_notes").val('');
                alert('Terima kasih kami ucapkan atas kado yang Bapak/Ibu/Sdr/i berikan.');
            }else{
                $.each(res.message, function( index, value ) {
                    text += '<p class="error"><i data-feather="x-square"></i> '+ value[0]+'</p>';
                });

                alert(text);
            }

        }
    });
});

function alert(msg) {
    alertify.alert().set(
        {
            title : 'Informasi',
            transition:'slide',
            message: msg,
            movable: true,
            closable :false
        }).show();
}
