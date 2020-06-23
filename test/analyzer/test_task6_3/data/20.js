var Configvolume = {
    newsubmit_url: "/servers/public/index.php?c=store&a=newsubmitpost",
    get_pro_info_url: "/servers/public/index.php?c=product&a=getproductinfo",
    get_product_license_url:
        "/servers/public/index.php?c=store&a=getproductlicense",
};

var Controlvolume = {
    init: function () {
        // var param = Funvolume.parseURL(document.location.href);
        var pro_id = $("input[name='pro_id']").val();

        //根据动作类型，显示不同的下拉
        var action_type = $("input[name='action_type']").val();
        // var action_type = param['action_type'];
        var change_id = "";
        if (action_type == "pc") {
            var change_id = "pc_name";
            $(".select_pc").show();
        } else if (action_type == "device") {
            $(".select_device").show();
            var change_id = "device_name";
        }

        if (payment_mode == "free_paypal") {
            $(".paypal").show();
        }

        //设置默认选中
        var object = $(
            "#pc_name option[value='2-5 PCs'], #device_name option[value='6-10 Devices']"
        );
        object.attr("selected", "selected");

        //设置改变下拉触发动作
        $("#pc_name, #device_name, #prefix_licence_name").change(function () {
            var pc_name = $("#pc_name").val();
            var device_name = $("#device_name").val();
            var prefix_licence_name = $("#prefix_licence_name").val();
            if (
                pc_name == "contact service" ||
                device_name == "contact service"
            ) {
                $(".buy_rbox").hide();
                $(".contact_rbox").show();
                return true;
            }

            $(".contact_rbox").hide();
            $.get(
                Configvolume.get_product_license_url,
                {
                    pc_name: pc_name,
                    device_name: device_name,
                    prefix_licence_name: prefix_licence_name,
                    pro_id: pro_id,
                    currency: "EUR",
                    action_type: action_type,
                    site_id: site_id,
                },
                function (data) {
                    if (data.price) {
                        $(".buy_rbox").show();
                        if (payment_mode == "avangate") {
                            $(".cart_url").attr("href", data.avangate_url);
                        } else if (payment_mode == "free_paypal") {
                            $(".cart_url").attr("href", data.cart_url);
                            $(".paypal_url").attr("href", data.paypal_url);
                        }
                        $(".price_text").html("€" + data.price);

                        if (
                            data.d_price &&
                            parseInt(data.d_price) > parseInt(data.price)
                        ) {
                            $(".price_d_text").html("€" + data.d_price);
                        } else {
                            $(".price_d_text").html("");
                        }
                    } else {
                        $(".buy_rbox").hide();
                    }
                },
                "json"
            );
            //设置购买提示选中的值
            if (
                $(this).attr("id") == "pc_name" ||
                $(this).attr("id") == "device_name"
            ) {
                $(".select_one").html($(this).find("option:selected").text());
            }
            $(".license_name").html(", " + prefix_licence_name);
        });

        if (change_id) {
            $("#" + change_id).change();
        }

        //获取产品数据
        if (pro_id) {
            $.get(
                Configvolume.get_pro_info_url,
                { site_id: site_id, pro_id: pro_id },
                function (data) {
                    if (data.name) {
                        $(".pro_name").html(data.name);
                        if (data.product_os == "Mac") {
                            $(".pro_mac").show();
                        } else if (data.product_os == "Win") {
                            $(".pro_win").show();
                        }
                        $("#hidden_product_ids").val(data.cbs_id);
                    }
                },
                "json"
            );
        }

        //获取IP地址对应国家代码（国外免费IP查询服务:http://www.telize.com/） 默认显示当前ip的国家
        $.getJSON("http://www.telize.com/geoip?callback=?", function (json) {
            var object = $(
                "#country option[value='" +
                    json.country_code.toLocaleLowerCase() +
                    "']"
            );
            object.attr("selected", "selected");
        });
    },
    checkSubmit: function () {
        var result = true;
        var email_reg = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,3}$/;
        var first_name = $.trim($("#first_name").val());
        var last_name = $.trim($("#last_name").val());
        var contact_email = $.trim($("#contact_email").val());
        var company = $.trim($("#company").val());
        var job_title = $.trim($.trim($("#job_title").val()));
        var phone = $("#phone").val();
        var area_code = parseInt($("#area_code").val());
        if (first_name == "") {
            Funvolume.showTip($("#first_name"));
            result = false;
        }
        if (last_name == "") {
            Funvolume.showTip($("#last_name"));
            result = false;
        }
        if (contact_email == "") {
            Funvolume.showTip($("#contact_email"));
            result = false;
        }
        if (!email_reg.test(contact_email)) {
            Funvolume.showTip($("#contact_email"));
            result = false;
        }
        if (company == "") {
            Funvolume.showTip($("#company"));
            result = false;
        }
        if (job_title == "") {
            Funvolume.showTip($("#job_title"));
            result = false;
        }
        if (phone == "") {
            Funvolume.showTip($("#phone"));
            result = false;
        }
        if (area_code == 0) {
            Funvolume.showTip($("#area_code"));
            result = false;
        }
        if (result) {
            $("#submit_query").removeAttr("onclick");
            var paramQuery = $("#submit_port").serialize();
            $.post(
                Configvolume.newsubmit_url,
                paramQuery,
                function (data) {
                    alert(data.msg);
                    if (data.state == "ok") {
                        var url = window.location.href;
                        window.location.href = url;
                    } else {
                        $("#submit_query").attr("onclick", "checkSubmit()");
                    }
                },
                "json"
            );
        }
    },
};
