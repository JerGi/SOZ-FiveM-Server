function CreateResaleZone(data)
    data.options = {
        {
            label = "Vendre l'énergie",
            icon = "c:upw/vendre.png",
            event = "soz-upw:client:ResaleEnergy",
            canInteract = function()
                return OnDuty()
            end,
            blackoutGlobal = true,
        },
    }

    return CreateZone("UPW", "Resale", data)
end

AddEventHandler("soz-upw:client:ResaleEnergy", function()
    local progress_success = exports["soz-core"]:ProgressSynchrone("soz-upw:progressbar:resale", "Vous vendez de l'énergie", Config.Upw.Resale.Duration, false,
                                                                   true, {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@mp_radio@garage@low", anim = "action_a", flags = 1}, nil, nil)

    if not progress_success then
        return
    end

    local res = QBCore.Functions.TriggerRpc("soz-upw:server:ResaleEnergy")
    local success, message = table.unpack(res)

    if success then
        exports["soz-core"]:DrawNotification(message, "success")
        TriggerEvent("soz-upw:client:ResaleEnergy")
    else
        exports["soz-core"]:DrawNotification(message, "error")
    end
end)
