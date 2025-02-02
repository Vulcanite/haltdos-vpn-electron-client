var VPN = function() {
    var config = null;
    var updateConnectionStatus = async function() {
        let respone = await window.ipcRender.invoke('status');
        if (respone.status == true) {
            $("#status").removeClass("bg-danger");
            $("#status").addClass("bg-success");
            $("#status").text("Connected");
            $("#connect").addClass("disabled");
            $("#disconnect").removeClass("d-none");
            $('form :input').prop('disabled', true);
        } else {
            $("#status").removeClass("bg-success");
            $("#status").addClass("bg-danger");
            $("#status").text("Disconnected");
            $("#disconnect").addClass("d-none");
            $("#connect").removeClass("disabled");
            $('form :input').prop('disabled', false);
        }
    };
    return {
        init: function() {
            updateConnectionStatus();
            // setInterval(function() {
            //     updateConnectionStatus();
            // }, 3000);
            //loadConfig(config);
        },
        connect: async function() {
            try {
                Validations.notEmpty($("#username"));
                Validations.notEmpty($("#password"));
                Validations.notEmpty($("#server"));
            } catch (e) {
                PlatformUtils.showError(e.source, e.message);
                return;
            }
            config = {
                "username": PlatformUtils.getTrimmedValue("username"),
                "password": PlatformUtils.getTrimmedValue("password"),
                "server": PlatformUtils.getTrimmedValue("server"),
                "toSave": $("#saveConfig").prop("checked")
            }
            console.log(config);
            let response = await window.ipcRender.invoke('connect', config);
            console.log("Config: " + response);
            if (response.status == true){
                updateConnectionStatus();
            }
        },
        disconnect: function() {
            window.ipcRender.send('disconnect');
            updateConnectionStatus();
        }
    }
}();
jQuery(document).ready(function() {
    VPN.init();
});