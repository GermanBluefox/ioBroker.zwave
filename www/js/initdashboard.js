var metadata = {};
var listDevices;
var deviceTable = [];
var allNodes = new Array();
var valTable = [];
var scenevalues = [];
var scenelabels = [];
var scenes = [];
var sceneValueTable = [];

function _createWindow() {
    var jqxWidget = $('#jqxWidget');
    var offset = jqxWidget.offset();

    $('#window').jqxWindow({
        position: { x: offset.left + 500, y: offset.top + 200} ,
        showCollapseButton: false, maxHeight: 600, maxWidth: 600, minHeight: 200, minWidth: 200, height: 540, width: 583,
        initContent: function () {
            $('#window').jqxWindow('focus');
        },
        'draggable': false,
        'resizable': false
    });
    $('#warning').jqxWindow({
        position: { x: offset.left + 500, y: offset.top + 200} ,
        showCollapseButton: false, maxHeight: 200, maxWidth: 400, minHeight: 200, minWidth: 400, height: 200, width: 400,
        initContent: function () {
            $('#window').jqxWindow('focus');
        },
        'draggable': false,
        'resizable': false
    });

    $('#error').jqxWindow({
        position: { x: offset.left + 500, y: offset.top + 200} ,
        showCollapseButton: false, maxHeight: 200, maxWidth: 400, minHeight: 200, minWidth: 400, height: 200, width: 400,
        initContent: function () {
            $('#window').jqxWindow('focus');
        },
        'draggable': true,
        'resizable': true
    });

    $("#submit").jqxButton({ width: '150'});
    $("#submit").on('click', function () {
        $('#warning').jqxWindow('close');
        submitAction("reset");
    });

    $("#cancel").jqxButton({ width: '150'});
    $("#cancel").on('click', function () {
        $('#warning').jqxWindow('close');
    });

    $("#close").jqxButton({ width: '150'});
    $("#close").on('click', function () {
        $('#error').jqxWindow('close');
    });
};

function menuAction(link) {
    var nodeid = $('#device_nodeid').val();
    var buttonid = 0;

    switch (link) {
        case 'add_device':
            submitAction(link);
            break;
        case 'remove_device':
            submitAction(link);
            break;
        case 'receive_config':
            submitAction(link);
            break;
        case 'refresh_node':
            submitAction(link, nodeid);
            break;
        case 'remove_failed_node':
            submitAction(link, nodeid);
            break;
        case 'has_node_failed':
            submitAction(link, nodeid);
            break;
        case 'request_node_neighbor_update':
            submitAction(link, nodeid);
            break;
        case 'assign_return_route':
            submitAction(link, nodeid);
            break;
        case 'delete_all_return_routes':
            submitAction(link, nodeid);
            break;
        case 'send_node_information':
            submitAction(link, nodeid);
            break;
        case 'create_primary':
            submitAction(link);
            break;
        case 'replace_failed_node':
            submitAction(link, nodeid);
            break;
        case 'transfer_primary':
            submitAction(link);
            break;
        case 'request_network_update':
            submitAction(link, nodeid);
            break;
        case 'replication_send':
            submitAction(link, nodeid);
            break;
        case 'add_button':
            submitAction(link, nodeid, buttonid);
            break;
        case 'remove_button':
            submitAction(link, nodeid, buttonid);
            break;
        case 'refresh_device':
            submitAction(link, nodeid);
            break;
        case 'refresh':
            location.reload();
            break;
        case 'about':
            $('#window').jqxWindow('open');
            break;
        case 'jqxwidgets':
            window.open('http://www.jqwidgets.com/', '_blank');
            break;
        default:
            break;
    }
}

function submitScene(action, label, sceneId, nodeId, commandclass, instance, index, value) {
    // alert("action: " + action + ", label: " + label);

    if (action == "createScene") {
        servConn._socket.emit('setState', 'zwave.0.GLOBAL_ACTION', {
            val: {action: action, label: label},
            ack: true
        }, function (err, res) {
            if (err !== undefined && err !== null) {
                $('#dummy').html("RESULT: " + res + "<br>ERROR: " + err);
                $('#error').jqxWindow('open');
            }
        });
    } else if (action == "removeScene") {
        servConn._socket.emit('setState', 'zwave.0.GLOBAL_ACTION', {
            val: {action: action, sceneId: label},
            ack: true
        }, function (err, res) {
            if (err !== undefined && err !== null) {
                $('#dummy').html("RESULT: " + res + "<br>ERROR: " + err);
                $('#error').jqxWindow('open');
            }
        });
    } else if (action == "addSceneValue" || action == "removeSceneValue") {
        servConn._socket.emit('setState', 'zwave.0.GLOBAL_ACTION', {
            val: {action: action, sceneId: sceneId, nodeId: nodeId, commandclass: commandclass, instance: instance, index: index, value: value},
            ack: true
        }, function (err, res) {
            if (err !== undefined && err !== null) {
                $('#dummy').html("RESULT: " + res + "<br>ERROR: " + err);
                $('#error').jqxWindow('open');
            }
        });
    }
}

function submitAction(action, nodeid, buttonid, name, location, heal, count, group, nodes) {
    if (nodeid != undefined) {
        if (buttonid != undefined) {
            servConn._socket.emit('setState', 'zwave.0.NODE' + nodeid, {
                val: {nodeid: nodeid, action: action, buttonid: buttonid},
                ack: true
            }, function (err, res) {
                if (err !== undefined && err !== null) {
                    $('#dummy').html("RESULT: " + res + "<br>ERROR: " + err);
                    $('#error').jqxWindow('open');
                }
            });
        } else if (name != undefined && location != undefined) {
            servConn._socket.emit('setState', 'zwave.0.NODE' + nodeid, {
                val: {nodeid: nodeid, action: action, name: name, location: location},
                ack: true
            }, function (err, res) {
                if (err !== undefined && err !== null) {
                    $('#dummy').html("RESULT: " + res + "<br>ERROR: " + err);
                    $('#error').jqxWindow('open');
                }
            });
        } else if (heal != undefined) {
            nodeid = nodeid.split(" - ")[0];

            servConn._socket.emit('setState', 'zwave.0.GLOBAL_ACTION', {
                val: {nodeid: nodeid, action: action, heal: heal, count: count},
                ack: true
            }, function (err, res) {
                if (err !== undefined && err !== null) {
                    $('#dummy').html("RESULT: " + res + "<br>ERROR: " + err);
                    $('#error').jqxWindow('open');
                }
            });
        } else if (group != undefined) {
            servConn._socket.emit('setState', 'zwave.0.NODE' + nodeid, {
                val: {nodeid: nodeid, action: action, group: group, target_nodeid: nodes},
                ack: true
            }, function (err, res) {
                if (err !== undefined && err !== null) {
                    $('#dummy').html("RESULT: " + res + "<br>ERROR: " + err);
                    $('#error').jqxWindow('open');
                }
            });
        } else {
            servConn._socket.emit('setState', 'zwave.0.NODE' + nodeid, {
                val: {nodeid: nodeid, action: action},
                ack: true
            }, function (err, res) {
                if (err !== undefined && err !== null) {
                    $('#dummy').html("RESULT: " + res + "<br>ERROR: " + err);
                    $('#error').jqxWindow('open');
                }
            });
        }
    } else {
        servConn._socket.emit('setState', 'zwave.0.GLOBAL_ACTION', {
            val: {action:action},
            ack: true
        }, function (err, res) {
            if (err !== undefined && err !== null) {
                $('#dummy').html("RESULT: " + res + "<br>ERROR: " + err);
                $('#error').jqxWindow('open');
            }
        });
    }
}

function submitConfig(action, nodeid) {
    var changeTable = "";

    var input_elems = document.querySelectorAll('input[id^="'+nodeid+'_'+action+'_"]');
    var select_elems = document.querySelectorAll('select[id^="'+nodeid+'_'+action+'_"]');
    var element;
    var type;
    var id;
    var value;
    var array;
    var comclass;
    var index;
    var oldElement;

    for (var i = 0; i < input_elems.length; i++) {
        element = input_elems[i];
        type = element.type;
        id = element.id;
        value = element.value;
        if (element.type == "text") {
            array = id.split("_");
            comclass = array[2];
            index = array[3];

            oldElement = document.getElementById("oldValue_" + id);
            if (oldElement !== undefined && oldElement !== null) {
                oldElement = oldElement.innerHTML;
            } else {
                oldElement = value;
            }
            if (oldElement !== value) {
                changeTable += index + ": OLD = " + oldElement + ", NEW = " + value + "<br>";
                submit_(nodeid, "change_"+action, value, index, comclass);
            }
        }
    }
    for (var e = 0; e < select_elems.length; e++) {
        element = select_elems[e];
        type = element.type;
        id = element.id;
        value = element.value;
        var label = element.selectedOptions[0].innerHTML;

        array = id.split("_");
        comclass = array[2];
        index = array[3];

        id = id.replace('_jqxDropDownList','');
        oldElement = document.getElementById("oldValue_" + id).innerHTML;
        if (label !== "" && oldElement !== label) {
            changeTable += index + ": OLD = " + oldElement + ", NEW = " + label + "<br>";
            submit_(nodeid, "change_"+action, value, index, comclass);
        }
    }

    return changeTable;
}

function submit_(nodeid, action, val, index, comclass) {
    servConn._socket.emit('setState', "zwave.0.NODE" + nodeid, {
        val: {nodeid:nodeid, action:action, paramValue: val, index: index, comclass: comclass},
        ack: true
    }, function (err, res) {
        if (err !== undefined && err !== null) {
            $('#dummy').html("RESULT: " + res + "<br>ERROR: " + err);
            $('#error').jqxWindow('open');
        }
    });
}

function initControllerTable() {
    var reset = $("#controller_reset");
    reset.jqxButton({ width: '150'});
    var softreset = $("#controller_softreset");
    softreset.jqxButton({ width: '150'});

    softreset.on('click', function () {
        submitAction("reset");

    });
    reset.on('click', function () {
        $('#warning').jqxWindow('open');
    });
}

function initTestHealPanel() {
    var testbutton = $("#testbutton");
    testbutton.jqxButton({width: '122'});

    testbutton.on('click', function () {
        var node = $('#testnode').val();
        var count = $('#testmcnt').val();
        var heal = $('#healrrs').val();
        var html;

        if (node !== undefined && node !== "Please Choose:") {
            html = "Send " + count + " messages to node '" + node + "' on the<br>network for testing network reliability.";
        } else {
            html = "Send " + count + " messages to every node on the<br>network for testing network reliability.";
        }

        if (heal) {
            html = "Heal network node '" + node + "' by requesting the node rediscover his neighbors." +
                "<br>Sends a ControllerCommand_RequestNodeNeighborUpdate to node '" + node + "'.<br>" +
                "Can take a while on larger networks.";
        }

        $("#testhealreport").html(html);
        submitAction("healNetwork", node, undefined, undefined, undefined, heal, count);
    });

    var source = allNodes;
    var index = source.length;
    $('#testnode').jqxDropDownList({source: source, width: '320', height: '25', selectedIndex: index});
    $('#testmcnt').jqxInput({height: 25, width: 115, minLength: 1});
    $('#healrrs').jqxCheckBox({width: '12px', height: '12px'});

    $('#healrrs').on('change', function (event) {
        var checked = event.args.checked;
        if (checked) {
            $("#testbutton").val("Heal");
            $('#testmcnt').jqxInput({ disabled:true });
        } else {
            $("#testbutton").val("Test");
            $('#testmcnt').jqxInput({ disabled:false });
        }
    });
}

function createNodeList() {
    var source = new Array();
    var index = 0;
    var selectObject = '<select id="'+id+'" name="input-value">';
    for (var l = 0; l < obj.native.values.length; l++) {
        var lbl = obj.native.values[l];
        if (lbl == value) {
            selectObject += '<option selected=selected value="'+l+'">'+lbl+'</option>';
            index = l;
        } else {
            selectObject += '<option value="'+l+'">'+lbl+'</option>';
        }
        source.push(lbl);
    }

    ret = selectObject+'</select>';

    retVal.push(ret);
    retVal.push("jqxDropDownList");
    retVal.push(source);
    retVal.push(index);
}

function initDeviceTable() {
    $('#teamsDataTable').on('rowSelect', function (event) {

        var boundIndex = event.args.boundIndex;
        var id = boundIndex + 1;
        var nodeid = event.args.row.team;
        $('#device_nodeid').val(nodeid);

        $("#globalTable").empty();

        scenelabels = [];
        scenevalues = [];
        $("#scenevaluetext1").val("");

        initConfigTable("config", id, nodeid);
        initConfigTable("system", id, nodeid);
        initConfigTable("user", id, nodeid);

        initGlobalTable(nodeid);

        // alert("scenelabels: " + JSON.stringify(scenelabels));
        // TODO: Check which Elements are already in use
        $("#scenevalues").jqxListBox({ source: scenelabels });

        var items = $("#scenescenevalues").jqxListBox('getItems');
        if (items != undefined) {
            for (var v = 0; v < scenelabels.length; v++) {
                var scene = scenelabels[v];
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.label == scene.label) {
                        var text = scene.html.split(" - ")[0];
                        alert(item.label + " | " + scene.label + " | " + scene.html);
                        $("#scenevalues").jqxListBox("disableItem", { html: scene.html });
                        break;
                    }

                }
            }
        }
        //        alert(allValues);

        $('#device_generictype').html(deviceTable[boundIndex].native.type);
        $('#device_product').html(deviceTable[boundIndex].native.product);
        $('#device_name').val(deviceTable[boundIndex].native.name);
        $('#device_location').val(deviceTable[boundIndex].native.loc);

        $('#device_value').html("19.14");
        $('#device_lastheard').html("18:04:12 GMT+1");
        $('#device_status').html("Probe (sleeping)");
    });
}

function initConfigTable(genre, row_id, node) {
    var html;
    if (genre == "config") {
        $("#configTable").empty();
        html = '<input type="button" value="Submit" id="changeConfig"/><hr><div id=changeTable' + genre + ' style="color:red;font-size: 10px;"></div><hr>';
        $("#configTable").append($(html));
        $("#changeConfig").jqxButton({ width: '150'});
        $("#changeConfig").on('click', function () {
            html = submitConfig("config", node);
            $("#changeTableconfig")[0].innerHTML = html;
        });
    } else if (genre == "system") {
        $("#infoTable").empty();
        html = '<input type="button" value="Submit" id="changeSystem"/><hr><div id=changeTable' + genre + ' style="color:red;font-size: 10px;"></div><hr>';
        $("#infoTable").append($(html));
        $("#changeSystem").jqxButton({ width: '150'});
        $("#changeSystem").on('click', function () {
            html = submitConfig("system", node);
            $("#changeTablesystem")[0].innerHTML = html;
        });
    } else if (genre == "user") {
        $("#valuesTable ").empty();
    }
    var rowData = [];

    var x = 0;

    for (var i in listDevices) {
        //if (listDevices[i].gridid != undefined) {
        //    var gridid = listDevices[i].gridid;
            // if (gridid == row_id) {
            // alert("nodeId: " + listDevices[i].native.nodeid);
            if (node == listDevices[i].native.nodeid) {
                var classes = listDevices[i].native.classes;
                for (var clazz in classes) {
                    var cl = classes[clazz];
                    // for (var claz in cl) {
                    for (var instance in cl) {
                        var inst = cl[instance];
                        for (var claz in inst) {
//                            alert("node = " + node + " clazz = " + clazz + " instance = " + instance + " claz = " + claz + " genre = " + genre);

                            // var clz = cl[claz];
                            var clz = inst[claz];
//                            alert(JSON.stringify(clz));
                            if (clz.genre == genre) {
//                                alert(clz.genre);
                                device = new Object();
                                device.comclass = clz.class_id;
                                device.genre = clz.genre;
                                device.index = clz.index;
                                device.instance = clz.instance;
                                device.label = clz.label;
                                device.max = clz.max;
                                device.min = clz.min;

                                device.nodeid = clz.node_id;
                                device.type = clz.type;

                                device.units = clz.units;
                                device.value = clz.value;
                                device.write_only = clz.write_only;
                                device.read_only = clz.read_only;

                                // TODO: Implement Help Function
                                device.help = clz.help;

                                device.name = calcName(device.nodeid, device.comclass, device.label);

                                var headHTML = "";
                                var inputHTML = "";
                                var footHTML = "";
                                var input;

                                headHTML += "<table border='0'><col width='450'><col width='450'><tr><td colspan=2>" + device.index + " - <b>" + device.label + "</b></td></tr>";
                                headHTML += "<tr><td colspan=2><em>" + device.help + "</em></td></tr>";
                                headHTML += "<tr><td>";

                                var id;
                                if (genre == "user") {
                                    id = device.nodeid + "_" + device.genre + "_" + device.comclass + "_" + device.index + "_" + device.type + "_" + x;
                                    x = x + 1;
                                } else {
                                    id = device.nodeid + "_" + device.genre + "_" + device.comclass + "_" + device.index + "_" + device.type;

                                    var retVal = createHTML(device, genre, id);
                                    inputHTML = retVal[0];
                                    input = retVal[1];

                                    var valueID = "oldValue_" + device.nodeid + "_" + device.genre + "_" + device.comclass + "_" + device.index + "_" + device.type;
                                    footHTML = "</td>";
                                    if (device.read_only == false) {
                                        if (device.type !== "button") {
                                            footHTML += "<td><em><div id='" + valueID + "'>" + device.value + "</div></em></td>";
                                        }
                                    } else {
                                        if (device.type == "list") {
                                            inputHTML = device.value;
                                            input = "";
                                        }
                                    }
                                    footHTML += "</tr></table><br><hr>";

                                    html = headHTML + inputHTML + footHTML;
                                }


                                if (genre == "config") {
                                    $("#configTable").append($(html));
                                } else if (genre == "system") {
                                    $("#infoTable").append($(html));
                                } else if (genre == "user") {
                                    $("#valuesTable").append($(html));
                                    var valObject = {label: device.label, value: device.value};
                                    valTable.push(valObject);
                                    if (!device.read_only) {
                                        var lbl = device.nodeid + ";" + device.comclass + ";" + device.instance + ";" + device.index;
                                        var table = {"label": lbl, "value": device.value, "html": device.label};
                                        scenelabels.push(table);
                                        sceneValueTable.push({id: lbl, label: device.nodeid + " - " + device.label});
                                        scenevalues.push(device.value);
                                    }
                                }

                                if (input == "jqxDropDownList") {
                                    var source = retVal[2];
                                    var index = retVal[3];
                                    $('#' + id).jqxDropDownList({
                                        source: source,
                                        width: '400',
                                        height: '25',
                                        selectedIndex: index
                                    });
                                } else if (input == "jqxInput") {
                                    $('#' + id).jqxInput({height: 25, width: 240, minLength: 1});
                                } else if (input == "jqxButton") {
                                    $('#' + id).jqxButton({width: '150'});

                                    $('#' + id).on('click', function () {
                                        $('#dummy').html('<br>Not implemented!');
                                        $('#error').jqxWindow('open');
                                    });

                                } else if (input == "jqxCheckBox") {
                                    $('#' + id).jqxCheckBox({width: '25px', height: '25px'});

                                    $('#' + id).val(device.value);
                                    if (device.read_only == true) {
                                        $('#' + id).jqxCheckBox({disabled: true});
                                    }
                                } else {
                                    // alert(retVal);
                                    //$('#' + id).jqxInput({height: 25, width: 300, minLength: 1});
                                }
                                rowData.push(device);
                            }
                        }
                    }
                }
            }
        //}
    }
}

// function createHTML(type, value, nodeid, label, genre, comclass, index, read_only) {
function createHTML(device, genre, id) {
    var type = device.type;
    var value = device.value;
    var nodeid = device.nodeid;
    var label = device.label;
    var comclass = device.comclass;
    var index = device.index;
    var read_only = device.read_only;

    var address;
    // var id = nodeid+"_"+genre+"_"+comclass+"_"+index+"_"+type;
    var retVal = new Array();
    var obj;
    var ret = "";

    if (type == "list") {
        if (objects['zwave.0.NODE'+nodeid] != undefined) {
            label = label.replace(/\./g, '_'); //.replace(/ /g, '_');
            if (genre == "config") {
                address = 'zwave.0.NODE'+nodeid+".CONFIGURATION."+label;
            } else {
                address = 'zwave.0.NODE'+nodeid;

                for (var o in metadata) {
                    obj = metadata[o];
                    if (obj._id.search(address) == 0 && obj._id.search(label) > 0) {
                        address = obj._id;
                    }
                }
            }
            obj = metadata[address];
            if (obj == undefined) {
                alert("This Address is not configured :" + address);
            }
            var source = new Array();
            var index = 0;
            var selectObject = '<select id="'+id+'" name="input-value">';

            var values = obj.native.values;
            for (var l = 0; l < values.length; l++) {
                var lbl = values[l];
                if (lbl == value) {
                    selectObject += '<option selected=selected value="'+l+'">'+lbl+'</option>';
                    index = l;
                } else {
                    selectObject += '<option value="'+l+'">'+lbl+'</option>';
                }
                source.push(lbl);
            }

            selectObject += '<option value=l>lbl</option>';

            ret = selectObject+'</select>';

            retVal.push(ret);
            retVal.push("jqxDropDownList");
            retVal.push(source);
            retVal.push(index);
        } else {
            alert("object for list not found");
        }

    } else if (type == "byte" || type == "short" || type == "int" || type == "decimal" || type == "string") {
        if (read_only == false) {
            ret = '<input type="text" id="'+id+'" value="'+value+'"/>';
            retVal.push(ret);
            retVal.push("jqxInput");
        } else {
            retVal.push(value);
        }
    } else if (type == "button") {
        value = "Submit";
        ret = '<input type="button" id="'+id+'" value="'+value+'"/>';
        retVal.push(ret);
        retVal.push("jqxButton");
    } else if (type == "bool") {
        // ret = "<div id='"+id+"' style='margin-left: 10px; float: left;'></div>";
        ret = "<div id='"+id+"'></div>";
        retVal.push(ret);
        retVal.push("jqxCheckBox");
    } else {
        ret = '<input type="text" id="'+id+'" value="'+value+'"/>';
        retVal.push(ret);
        retVal.push("jqxInput");
    }

    if (read_only == true && type !== "list" && type !== "bool") {
        retVal[0] = value;
    }
    return retVal;
}

function initValuesTable() {
}

function initInfoTable() {

}

function getConfig() {
    //servConn._socket.emit('getConfig', function (data) {
    servConn._socket.emit('getObject', 'system.adapter.zwave', function (err, obj) {
        $('.version').html(obj.common.installedVersion);

        servConn._socket.emit('getObject', "system.config", function (err, config) {
            language = config.language || 'de';
            //translate();

            var tmp = window.location.hash.slice(1).split('/');
            hash = tmp[1];

            var count = 0;

            if (tmp[2]) {
                var index = $('#tabs-main a[href="#' + tmp[2] + '"]').parent().index();
                $tabsMain.tabs("option", "active", index - 2);
            }
        });
    });
}

function getDevices(callback) {
    getData( function() {
        listDevices = objects;
        // console.log(listDevices);
        refreshGridDevices();

        $("#globalTable").empty();
        initConfigTable("config", 1, 1);
        initConfigTable("system", 1, 1);
        initConfigTable("user", 1, 1);

        initGlobalTable(1);

        $('#device_nodeid').val(1);
    });
}

function getData(callback) {
    var objectsReady;
    var statesReady;

    console.log('requesting all states');
    servConn.getStates('*', function (err, res) {
        //$('#load_grid-devices').hide();
        states = res;
        statesReady = true;
        console.log('received all states');
        if (objectsReady && typeof callback === 'function') callback();
    });

    console.log('requesting all objects');

    servConn.getObjects(function (err, res) {
        metadata = {};
        objects = {};
        enums = [];
        for (var object in res) {
            var obj = res[object];
            if (obj._id.search("zwave") == 0) {
                if (obj.type == "device") {
                    objects[obj._id] = obj;
                } else {
                    metadata[obj._id] = obj;
                }
            }
            if (res[object].type === 'enum') enums.push(res[object]._id);
        }
        objectsReady = true;
        console.log('received all objects');
        if (statesReady && typeof callback === 'function') callback();
    });
}

function createLine(nr, name, array, allNodes) {
    var lines = '<td>' + nr + '</td>';
    lines += '<td>' + name + '</td>';

    if (array.length == 0) {
        array.push(0);
    }

    for (var n = 0; n < array.length; n++) {
        for (var a = 0; a < allNodes.length; a++) {
            lines += '<td width="20">';
            var node = parseInt(array[n]);
            var all = allNodes[a];
            if (node == all) {
                lines += '<div class="rtDiv line1 rtDirect" data-position="top">';
                n++;
            } else if (all == nr) {
                lines += '<div class="rtDiv rtUnavailable" data-position="top">';
            } else {
                lines += '<div class="rtDiv line1 rtNotLinked" data-position="top">';
            }
            lines += '<span class="info ng-binding">&nbsp;&nbsp;</span></div></td>';
        }
    }

    // TODO: Add Last Update
    // lines += '<td style="text-align: right;"><span id="update1" class="">15:06</span></td>';

    lines += '<td class="ng-scope">';
    lines += '&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" value="Update" id="updatenode_' + nr + '">';
    lines += '</td></tr>';

    return lines;
}

function createHeader(array) {
    var lines = '<col width="20"><col width="150"><thead><tr style="border-bottom:1pt solid black;"><th class="rtHeader ng-binding">Id</th><th class="rtHeader ng-binding">Device name</th>';
    for (var n = 0; n < array.length; n++) {
        var node = array[n];
        lines += '<th style="text-align:center;">' + node + '</th>';
    }

    // TODO: Add Last Update
    // lines += '<th class="rtHeader ng-binding" style="text-align: right;">Updated</th>';
    lines += '<th class="rtHeader"><i class="fa fa-spinner fa-spin fa-lg" style="display: none;"></i></th>';

    lines += '</tr></thead>';
    return lines;

}

function initTopologyPanel() {
    var topologyTable = $("#topologyTable");
    topologyTable.empty();
    var tableBegin = '<table id="RoutingTable" style="border-collapse:collapse;">';
    var tableEnd = '</table>';
    allNodes.sort(function(a, b) {
        return a - b;
    });

    var all = [];
    for (a = 0; a < allNodes.length; a++) {
        var node = allNodes[a];
        node = node.split(" - ")[0];
        all.push(node);
    }
    all.sort(function(a, b) {
        return a - b;
    });

    var headerLine = createHeader(all);

    var html = tableBegin + headerLine;

    var lines = '<tbody><tr style="border-bottom:1pt solid green;">';
    for (var i in listDevices) {
        if (listDevices[i].native.nodeid != undefined) {
            var nodeid = listDevices[i].native.nodeid;
            var name = listDevices[i].native.name;
            var neighbors = listDevices[i].native.neighbors == undefined ? [0] : listDevices[i].native.neighbors;
            if (neighbors != undefined) {
                lines += createLine(nodeid, name, neighbors, all);
            }
            lines += '</tr><tr style="border-bottom:1pt solid green;">';
        }
    }
    lines += '</tr></tbody>';

    html += lines + tableEnd;
    topologyTable.append(html);
    for (var n = 0; n < all.length; n++) {
        var node = all[n];
        var updateNode = $('#updatenode_' + node);
        updateNode.jqxButton({ width: '70px'});

        updateNode.on('click', function (event) {
            var node = event.currentTarget.id;
            node = node.replace("updatenode_","");

            submitAction("updatenode", node);
        });
    }
}

function initGlobalTable(row_id) {
    for (var i in listDevices) {
        if (listDevices[i].native.nodeid != undefined) {
            var gridid = listDevices[i].native.nodeid;
            if (gridid == row_id) {
                var native = listDevices[i].native;

                if (row_id == 1) {
                    var controllerNodeId = native.controllerNodeId;
                    var sucNodeId = native.sucNodeId;
                    var isPrimaryController = native.isPrimaryController ? "true" : "false";
                    var isStaticController = native.isStaticController ? "true" : "false";
                    var isBridgeController = native.isBridgeController ? "true" : "false";
                    var libraryVersion = native.libraryVersion;
                    var libraryTypeName = native.libraryTypeName;
                    var sendQueueCount = native.sendQueueCount;

                    var controller_devicename = native.devicename;
                    var controller_id = native.homeid;

                    $("#controller_nodeid").html(controllerNodeId);
                    $("#controller_suc_nodeid").html(sucNodeId);
                    $("#controller_primary").html(isPrimaryController);
                    $("#controller_static").html(isStaticController);
                    $("#controller_bridge").html(isBridgeController);
                    $("#controller_version").html(libraryVersion);
                    $("#controller_type").html(libraryTypeName);
                    $("#controller_sqc").html(sendQueueCount);

                    $("#controller_devicename").html(controller_devicename);
                    $("#controller_id").html(controller_id);
                }
                var numGroups = native.numGroups;
                var pollInterval = native.pollInterval;

                var globalTable = $("#globalTable");
                // globalTable.append("<hr>Groups:<br>");
                globalTable.append("<hr>");
                for (var g = 1; g <= numGroups; g++) {
                    // Create NodeList
                    var source1 = allNodes;

                    var box = "groupnode_" + g;
                    var button = "buttonnode_" + g;

                    var arr = native["Group_"+g].split(";");
                    var label = arr[0];
                    var associations = arr[1];
                    var max_associations = arr[2];

                    var table = "<table><col width='200'><col width='200'><col width='100'><tr><td>" + label + "<br><br>" +
                        "<em>Max Associations: " + max_associations + "</em><br><br>" +
                        "<input type='button' id='"+button+"' value='Submit'></td><td><div id=" + box + "></div></td></tr></table><hr>";

                    globalTable.append(table);
                    globalTable.append("<input type=hidden id=" + box + "_max value='" + max_associations + "'>");

                    var multiple = true;
                    if (max_associations == 1) {
                        multiple = false;
                    }
                    $('#' + box).jqxListBox({ source: source1, width: 350, height: 200, multiple: multiple });

                    //alert("ALL: " + associations);
                    var array = associations.split(",");
                    $('#' + box).jqxListBox('clearSelection');

                    for (var a = 0; a < array.length; a++) {
                        //console.log("array[a] = " + array[a] + " a = " + a);
                        for (var s = 0; s < source1.length; s++) {
                            //console.log("source1[s] = " + source1[s] + " s = " + s);
                            var sa = source1[s].split(" - ")[0];
                            //console.log("sa = " + sa);

                            if (sa == array[a]) {
                                //console.log("CHECKED");
                                var item = $('#' + box).jqxListBox('getItem', s );
                                $('#' + box).jqxListBox('selectItem', item);
                            }
                        }
                    }

                    $('#' + button).jqxButton({ width: '150'});

                    $('#' + button).on('click', function (event) {
                        var id = $('#' + event.target.id).selector;
                        var group = id.replace("button", "group");
                        var groupid = group.replace("#groupnode_","");

                        var items = $(group).jqxListBox('getSelectedItems');
                        var nodes = [];
                        for (var i = 0; i < items.length; i++) {
                            var value = items[i].value;
                            nodes.push(value.split(" - ")[0]);
                        }
                        var nodeid = $('#device_nodeid').val();
                        submitAction("association", nodeid, undefined, undefined, undefined, undefined, undefined, groupid, nodes);
                    });

                    var last_valid_selection = null;
                    var selected = "";

                    $('#' + box).on('change', function (event) {
                        var index = event.args.index;
                        var max = $('#' + event.target.id + "_max").val();
                        var items = $('#' + event.target.id).jqxListBox('getSelectedItems');

                        if (items.length > max) {
                            $('#dummy').html('You can only choose ' + max + '!');
                            $('#error').jqxWindow('open');
                            var item = $('#' + event.target.id).jqxListBox('getItem', index );
                            $('#' + event.target.id).jqxListBox('unselectItem', item);
                        }
                    });
                }

                /*
                globalTable.append("<br>Scenes:<br>");
                for (var n = 0; n < scenes.length; n++) {
                    var scene = scenes[n];
                    globalTable.append("SCENE: " + scenes + "<br>");
                }
                globalTable.append("<br><br>");
                */
            }
        }
    }
}

function sceneManagement() {
    $("#scenelabeltext").jqxInput({ height: 25, width: 195, minLength: 1, maxLength: 50 , disabled: true});
    $("#scenevaluetext1").jqxInput({ height: 25, width: 195, minLength: 1, maxLength: 50, disabled: true });
    $("#scenevaluetext2").jqxInput({ height: 25, width: 195, minLength: 1, maxLength: 50, disabled: true });
    $("#scenevalueunits").jqxInput({ height: 25, width: 195, minLength: 1, maxLength: 50, disabled: true });

    $("#scenedelete").jqxButton({ width: '100', disabled: true});
    $("#sceneexecute").jqxButton({ width: '100', disabled: true});
    $("#updatescenelabel").jqxButton({ width: '100', disabled: true});
    $("#savescenevalue").jqxButton({ width: '100', disabled: true});
    $("#removescenevalue").jqxButton({ width: '100', disabled: true});
    $("#updatescenevalue").jqxButton({ width: '100', disabled: true});
    $("#scenecreate").jqxButton({ width: '100'});

    var source = [];
    $("#sceneids").jqxListBox({ source: source, width: 350, height: 200, multiple: false });

    for (var n = 0; n < scenes.length; n++) {
        var scene = scenes[n];
        var label = scene.label;
        var value = scene.sceneid;

        label = value + " - " + label;
        $("#sceneids").jqxListBox('addItem', { label: label, value: value } );
    }

    // TODO: REMOVE
//    $("#scenescenevalues").jqxListBox({ source: scenevalues, width: 200, height: 180, multiple: false });
    $("#scenescenevalues").jqxListBox({ source: [], width: 200, height: 180, multiple: false });

    var nodeid = $('#device_nodeid').val();

    for (var v = 0; v < valTable.length; v++) {
        var valObject = valTable[v];
        var label = valObject.label;
        var value = valObject.value;
    }

    $("#scenedelete").on('click', function () {
        var item = $("#sceneids").jqxListBox('getSelectedItems');

        $("#sceneids").jqxListBox('removeItem', item[0].value );

        $("#sceneids").jqxListBox('selectIndex', 0 );
        $("#sceneids").jqxListBox('unselectIndex', 0 );
        $("#scenelabeltext").val("");

        $("#scenedelete").jqxButton({ disabled: true});
        $("#scenelabeltext").jqxInput({ disabled: true });
        $("#updatescenelabel").jqxButton({ disabled: true});

        submitScene("removeScene", item[0].value);
    });

    $("#sceneexecute").on('click', function () {
        alert("zwave.activateScene(sceneId);");
    });

    $("#updatescenevalue").on('click', function () {
        $('#dummy').html("<br>Not supported now!");
        $('#error').jqxWindow('open');
        return;

        var value = $("#scenevaluetext2").val();
        var nodeId = $('#device_nodeid').val();
//        alert("nodeid: " + nodeid + ", value: " + value);
//        alert("zwave.createScene(label);");
//        alert("zwave.addSceneValue(sceneId, nodeId, commandclass, instance, index, value);");

        var item = $("#sceneids").jqxListBox('getSelectedItems');
        var label = item[0].label;

        if (label.indexOf(" - ") == -1) {
            label = label.split(" - ")[1];
            // submitScene("createScene", label);
        }
    });

    $("#scenevalues").on('bindingComplete', function (event) {
        var items = $("#scenescenevalues").jqxListBox('getItems');
        var nodeid = $('#device_nodeid').val();

        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            var label = item.label;
            var id = label.split(" - ")[0];
            label = label.split(" - ")[1];

            if (id == nodeid) {
                $("#scenevalues").jqxListBox("disableItem", label);
            }
        }
    });

    $("#savescenevalue").on('click', function () {
        var items = $("#sceneids").jqxListBox('getItems');
        if (items.length > 0) {
            var scene = $("#sceneids").jqxListBox('getSelectedItems')[0];
            if (scene == undefined) {
                $('#dummy').html("<br>Please select a Scene!");
                $('#error').jqxWindow('open');
            } else {
                var value = $("#scenevaluetext1").val();

                var item = $("#scenevalues").jqxListBox('getSelectedItems')[0];
                var nodeId = $('#device_nodeid').val();
                var label = nodeId + " - " + item.html;
                $("#scenescenevalues").jqxListBox('addItem', { label: label, value: value } );

                $("#scenevalues").jqxListBox("disableItem", item.value);

                $("#scenevalues").jqxListBox('selectIndex', 0 );
                $("#scenevalues").jqxListBox('unselectIndex', 0 );

                $("#scenescenevalues").jqxListBox('selectIndex', 0 );
                $("#scenescenevalues").jqxListBox('unselectIndex', 0 );

                $("#scenevaluetext1").val("");

                $("#savescenevalue").jqxButton({ disabled: true});
                // asdf
                var table = item.label.split(";");
                var sceneId = scene.value;
                var nodId = table[0];
                var commandclass = table[1];
                var instance = table[2];
                var index = table[3];

                // alert("nodeId: " + nodeId + " sceneId: " + sceneId + " commandClass: " + commandclass + " instance: " + instance + " index: " + index + " value: " + value);
                submitScene("addSceneValue", undefined, sceneId, nodeId, commandclass, instance, index, value);
            }
        } else {
            $('#dummy').html("<br>There is no Scene available.<br>Create one!");
            $('#error').jqxWindow('open');
        }
    });

    $("#removescenevalue").on('click', function () {
        var item = $("#scenescenevalues").jqxListBox('getSelectedItems')[0];
        var label = item.label;
        var index = item.index;
        // TODO: Get Correct NodeId from item.label
        // var nodeId = $('#device_nodeid').val();
        var scene = $("#sceneids").jqxListBox('getSelectedItems')[0];

        $("#scenescenevalues").jqxListBox("removeAt", index);

        label = label.split(" - ")[1];
        // $("#scenevalues").jqxListBox('enableItem', label );
        // asdf

        $("#scenescenevalues").jqxListBox('selectIndex', 0 );
        $("#scenescenevalues").jqxListBox('unselectIndex', 0 );
        $("#removescenevalue").jqxButton({ disabled: true});

        var value = $("#scenevaluetext2").val();

        $("#scenevaluetext2").val("");

        var table = item.label.split(";");
        var sceneId = scene.value;
        var nodeId = table[0];
        var commandclass = table[1];
        var instance = table[2];
        var index = table[3];

        // alert("nodeId: " + nodeId + ", sceneId: " + sceneId + ", commandClass: " + commandclass + ", instance: " + instance + ", index: " + index + ", value: " + value);
        submitScene("removeSceneValue", undefined, sceneId, nodeId, commandclass, instance, index, value);
    });

    $("#scenecreate").on('click', function () {
        $("#sceneids").jqxListBox('addItem', "New Scene" );
    });

    $("#updatescenelabel").on('click', function () {
        $('#dummy').html("<br>Not supported now!");
        $('#error').jqxWindow('open');
        return;

        var item = $("#sceneids").jqxListBox('getSelectedItems');
        var label = $("#scenelabeltext").val();
        var index = item[0].index;

        $("#sceneids").jqxListBox('updateAt', { label: label, value: label }, index);
        submitScene("createScene", label);
    });

    $("#scenescenevalues").on('select', function (event) {
        var args = event.args;
        if (args) {
            var index = args.index;
            var item = args.item;
            var originalEvent = args.originalEvent;
            // get item's label and value.
            var label = item.label;
            var value = item.value;

            $("#scenevaluetext2").val(value);

            $("#removescenevalue").jqxButton({ disabled: false});
            $("#updatescenevalue").jqxButton({ disabled: false});
            $("#scenevaluetext2").jqxInput({ disabled: false});
        }
    });

    $("#scenevalues").on('ondblclick', function() {
        alert("clicked");
    });

    $("#scenevalues").on('select', function (event) {
        var args = event.args;
        if (args) {
            var index = args.index;
            var item = args.item;
            var originalEvent = args.originalEvent;
            // get item's label and value.
            var label = item.label;
            var value = item.value;

            var val = scenevalues[index];

            $("#scenevaluetext1").val(val);

            $("#savescenevalue").jqxButton({ disabled: false});
            $("#scenevaluetext1").jqxInput({ disabled: false});
        }
    });

    $("#sceneids").on('select', function (event) {
        var args = event.args;
        if (args) {
            var index = args.index;
            var item = args.item;
            var originalEvent = args.originalEvent;
            // get item's label and value.
            var label = item.label;
            var value = item.value;

            if (label.indexOf(" - ") > -1) {
                label = label.split(" - ")[1];
            }
            $("#scenedelete").jqxButton({ disabled: false});
            $("#scenelabeltext").jqxInput({ disabled: false});
            $("#scenelabeltext").val(label);
            $("#updatescenelabel").jqxButton({ disabled: false});

            var src = [];
            for (var s in scenes) {
                var scene = scenes[s]
                if (scene.label == label) {
                    var all = scene.scenes;
                    for (var a = 0; a < all.length; a++) {
                        var obj = all[a];

                        var nodeId = obj.nodeId;
                        var commandclass = obj.commandclass;
                        var instance = obj.instance;
                        var index = obj.index;
                        var value = obj.value;
                        var html = obj.html;

                        var table = nodeId + ";" + commandclass + ";" + instance + ";" + index;
                        var lbl;

                        for (var v = 0; v < sceneValueTable.length; v++) {
                            var vt = sceneValueTable[v];
                            // {"id":"135;1;0","label":"Indicator"}
                            var id = vt.id;
                            if (table == id) {
                                lbl = vt.label;
                                break;
                            }
                        }
                        var obj = { label: table, value: value, html: lbl };
                        src.push(obj);
                    }
                    $("#scenescenevalues").jqxListBox({ source: src });
                }
            }
        }
    });
}

function refreshGridDevices() {
    $('#device_name').jqxInput({height: 25, width: 300, minLength: 1});
    $('#device_location').jqxInput({height: 25, width: 300, minLength: 1});
    var device_naming_submit = $("#device_naming_submit");
    device_naming_submit.jqxButton({ width: '150'});

    device_naming_submit.on('click', function () {
        var device_name = $('#device_name').val();
        var device_location = $('#device_location').val();
        var nodeid = $('#device_nodeid').val();
        submitAction("naming", nodeid, undefined, device_name, device_location);
    });

    if (!listDevices) {
        alert('error: listDevices empty');
        return;
    }

    var teamData = [];
    var x = 0;
    for (var i in listDevices) {
        var member = {};
        member.team = listDevices[i].native.nodeid;
        member.lead = listDevices[i].native.product;

        var text = member.team + " - " + member.lead;
        allNodes.push(text);

        initConfigTable("user", 1, member.team);
        // Scenes are only in Node 1 (Controller) saved
        if (member.team == 1) {
            // TODO: Remove sample Table
            scenes = listDevices[i].native.scenes;
        }
        x=x+1;
        listDevices[i].gridid = x;
        var device = listDevices[i];
        deviceTable.push(device);
// console.log(deviceTable); // TODO: REMOVE LOG
        teamData.push(member);
    }

    /*
    teamData.sort(function(a, b) {
        return a - b;
    });
    */

    var source = {
        dataType: "json",
        dataFields: [{
            name: 'team',
            type: 'string'
        }, {
            name: 'lead',
            type: 'string'
        }],
        localdata: teamData
    };
    var dataAdapter = new $.jqx.dataAdapter(source);

    $("#teamsDataTable").jqxDataTable({
        width: '100%',
        height: '100%',
        source: dataAdapter,
        ready: function () {
            $("#teamsDataTable").jqxDataTable('selectRow', 0);
        },
        columns: [{
            text: 'ID',
            dataField: 'team',
            width: 30
        }, {
            text: 'Object',
            dataField: 'lead'
        }]
    });

    sceneManagement();
}

function calcName(nodeid, comclass, idx, instance) {
    // TODO: REMOVE HARDCODE zwave.node0
    var name = "zwave.0" + ".NODE" + nodeid;
    if (comclass) {
        name += '.' + ((comclasses[comclass] ? comclasses[comclass].name : null) || ('CLASSES' + comclass));

        if (idx !== undefined) {
            idx = idx.replace(/\./g, '_');
            name = name + '.' + idx;

            if (instance != undefined) {
                name = name + "_" + instance;
            }
        }
    }

    var i = name.lastIndexOf(".");
    var len = name.length-1;
    if (i == len) {
        name = name.substring(0, len);
    }
    return name;
}

var comclasses = {
    0x20:{name: 'BASIC',                                  role: 'switch', children: {
        Basic: {role: 'level'}
    }},
    0x86:{name: 'VERSION',                                role: 'meta.version', children: {
        'Library Version':    {type: 'text'},
        'Protocol Version':   {type: 'text'},
        'Application Version':{type: 'text'}
    }},
    0x80:{name: 'BATTERY',                                role: 'info', children: {
        'Battery Level':    {role: 'value.battery'}
    }},
    0x84:{name: 'WAKE_UP',                                role: ''},
    0x21:{name: 'CONTROLLER_REPLICATION',                 role: ''},
    0x26:{name: 'SWITCH_MULTILEVEL',                      role: 'light.dimmer', children: {
        Level: {role: 'level.dimmer'}
    }},
    0x27:{name: 'SWITCH_ALL',                             role: ''},
    0x30:{name: 'SENSOR_BINARY',                          role: 'sensor'},
    0x31:{name: 'SENSOR_MULTILEVEL',                      role: 'sensor', children: {
        Temperature: {role: 'value.temperature'}
    }},
    0x9c:{name: 'SENSOR_ALARM',                           role: 'alarm'},
    0x71:{name: 'ALARM',                                  role: ''},
    0x8F:{name: 'MULTI_CMD',                              role: ''},
    0x46:{name: 'CLIMATE_CONTROL_SCHEDULE',               role: ''},
    0x81:{name: 'CLOCK',                                  role: ''},
    0x85:{name: 'ASSOCIATION',                            role: ''},
    0x70:{name: 'CONFIGURATION',                          role: 'meta.config', children: {
        Level: {role: 'level.dimmer'}
    }},
    0x72:{name: 'MANUFACTURER_SPECIFIC',                  role: ''},
    0x22:{name: 'APPLICATION_STATUS',                     role: ''},
    0x9B:{name: 'ASSOCIATION_COMMAND_CONFIGURATION',      role: ''},
    0x95:{name: 'AV_CONTENT_DIRECTORY_MD',                role: ''},
    0x97:{name: 'AV_CONTENT_SEARCH_MD',                   role: ''},
    0x96:{name: 'AV_RENDERER_STATUS',                     role: ''},
    0x99:{name: 'AV_TAGGING_MD',                          role: ''},
    0x50:{name: 'BASIC_WINDOW_COVERING',                  role: ''},
    0x2A:{name: 'CHIMNEY_FAN',                            role: ''},
    0x8D:{name: 'COMPOSITE',                              role: ''},
    0x62:{name: 'DOOR_LOCK',                              role: ''},
    0x90:{name: 'ENERGY_PRODUCTION',                      role: ''},
    0x7a:{name: 'FIRMWARE_UPDATE_MD',                     role: ''},
    0x8C:{name: 'GEOGRAPHIC_LOCATION',                    role: ''},
    0x7B:{name: 'GROUPING_NAME',                          role: ''},
    0x82:{name: 'HAIL',                                   role: ''},
    0x87:{name: 'INDICATOR',                              role: ''},
    0x9A:{name: 'IP_CONFIGURATION',                       role: 'meta.config'},
    0x89:{name: 'LANGUAGE',                               role: ''},
    0x76:{name: 'LOCK',                                   role: ''},
    0x91:{name: 'MANUFACTURER_PROPRIETARY',               role: ''},
    0x35:{name: 'METER_PULSE',                            role: ''},
    0x32:{name: 'METER',                                  role: ''},
    0x51:{name: 'MTP_WINDOW_COVERING',                    role: ''},
    0x8E:{name: 'MULTI_INSTANCE_ASSOCIATION',             role: ''},
    0x60:{name: 'MULTI_INSTANCE',                         role: ''},
    0x00:{name: 'NO_OPERATION',                           role: ''},
    0x77:{name: 'NODE_NAMING',                            role: ''},
    0xf0:{name: 'NON_INTEROPERABLE',                      role: ''},
    0x73:{name: 'POWERLEVEL',                             role: ''},
    0x88:{name: 'PROPRIETARY',                            role: ''},
    0x75:{name: 'PROTECTION',                             role: ''},
    0x7c:{name: 'REMOTE_ASSOCIATION_ACTIVATE',            role: ''},
    0x7d:{name: 'REMOTE_ASSOCIATION',                     role: ''},
    0x2b:{name: 'SCENE_ACTIVATION',                       role: ''},
    0x2C:{name: 'SCENE_ACTUATOR_CONF',                    role: ''},
    0x2D:{name: 'SCENE_CONTROLLER_CONF',                  role: ''},
    0x93:{name: 'SCREEN_ATTRIBUTES',                      role: ''},
    0x92:{name: 'SCREEN_MD',                              role: ''},
    0x98:{name: 'SECURITY',                               role: ''},
    0x9E:{name: 'SENSOR_CONFIGURATION',                   role: ''},
    0x9d:{name: 'SILENCE_ALARM',                          role: ''},
    0x94:{name: 'SIMPLE_AV_CONTROL',                      role: ''},
    0x25:{name: 'SWITCH_BINARY',                          role: 'switch'},
    0x28:{name: 'SWITCH_TOGGLE_BINARY',                   role: ''},
    0x29:{name: 'SWITCH_TOGGLE_MULTILEVEL',               role: ''},
    0x44:{name: 'THERMOSTAT_FAN_MODE',                    role: ''},
    0x45:{name: 'THERMOSTAT_FAN_STATE',                   role: ''},
    0x38:{name: 'THERMOSTAT_HEATING',                     role: ''},
    0x40:{name: 'THERMOSTAT_MODE',                        role: ''},
    0x42:{name: 'THERMOSTAT_OPERATING_STATE',             role: ''},
    0x47:{name: 'THERMOSTAT_SETBACK',                     role: ''},
    0x43:{name: 'THERMOSTAT_SETPOINT',                    role: ''},
    0x8B:{name: 'TIME_PARAMETERS',                        role: ''},
    0x8a:{name: 'TIME',                                   role: ''},
    0x63:{name: 'USER_CODE',                              role: ''},
    0x34:{name: 'ZIP_ADV_CLIENT',                         role: ''},
    0x33:{name: 'ZIP_ADV_SERVER',                         role: ''},
    0x2F:{name: 'ZIP_ADV_SERVICES',                       role: ''},
    0x2e:{name: 'ZIP_CLIENT',                             role: ''},
    0x24:{name: 'ZIP_SERVER',                             role: ''},
    0x23:{name: 'ZIP_SERVICES',                           role: ''}
};

function getTheme() {
    var theme = document.body ? $.data(document.body, 'theme') : null
    if (theme == null) {
        theme = '';
    }
    else {
        return theme;
    }

    theme = 'ui-start';

    var url = "js/jqwidgets/styles/jqx." + theme + '.css';
    if (window.location.href.toString().indexOf("angularjs") >= 0) {
        var loc = window.location.href.toString();
        if (loc.indexOf('button') >= 0 ||
            loc.indexOf('grid') >= 0 ||
            loc.indexOf('dropdownlist') >= 0 ||
            loc.indexOf('combobox') >= 0 ||
            loc.indexOf('datatable') >= 0 ||
            loc.indexOf('listbox') >= 0 ||
            loc.indexOf('tabs') >= 0 ||
            loc.indexOf('menu') >= 0 ||
            loc.indexOf('calendar') >= 0 ||
            loc.indexOf('datetimeinput') >= 0 ||
            (loc.indexOf('chart') >= 0 && loc.indexOf('bulletchart') == -1)) {
            url = "js/jqwidgets/styles/jqx." + theme + '.css';
        }
    }

    if (document.createStyleSheet != undefined) {
        var hasStyle = false;
        $.each(document.styleSheets, function (index, value) {
            if (value.href != undefined && value.href.indexOf(theme) != -1) {
                hasStyle = true;
                return false;
            }
        });
        if (!hasStyle) {
            document.createStyleSheet(url);
        }
    }
    else {
        var hasStyle = false;
        if (document.styleSheets) {
            $.each(document.styleSheets, function (index, value) {
                if (value.href != undefined && value.href.indexOf(theme) != -1) {
                    hasStyle = true;
                    return false;
                }
            });
        }
        if (!hasStyle) {
            var link = $('<link rel="stylesheet" href="' + url + '" media="screen" />');
            link[0].onload = function () {
                if ($.jqx && $.jqx.ready) {
                    $.jqx.ready();
                };
            }
            $(document).find('head').append(link);
        }
    }
    $.jqx = $.jqx || {};
    $.jqx.theme = theme;
    return theme;
};
var theme = '';
try {
    if (jQuery) {
        theme = getTheme();
        if (window.location.toString().indexOf('file://') >= 0) {
            var loc = window.location.toString();
            var addMessage = false;
            if (loc.indexOf('grid') >= 0 || loc.indexOf('chart') >= 0 || loc.indexOf('tree') >= 0 || loc.indexOf('list') >= 0 || loc.indexOf('combobox') >= 0 || loc.indexOf('php') >= 0 || loc.indexOf('adapter') >= 0 || loc.indexOf('datatable') >= 0 || loc.indexOf('ajax') >= 0) {
                addMessage = true;
            }

            if (addMessage) {
                $(document).ready(function () {
                    setTimeout(function () {
                            $(document.body).prepend($('<div style="font-size: 12px; font-family: Verdana;">Note: To run a sample that includes data binding, you must open it via "http://..." protocol since Ajax makes http requests.</div><br/>'));
                        }
                        , 50);
                });
            }
        }
    }
    else {
        $(document).ready(function () {
            theme = getTheme();
        });
    }
} catch (error) {
    var er = error;
}

$(document).ready(function () {
    _createWindow();
    $('#window').jqxWindow('close');
    $('#warning').jqxWindow('close');
    $('#error').jqxWindow('close');
});
