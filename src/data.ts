type record = {
    id: string,
    ranking: string,
    name: string,
    time: number,
    removed: boolean
}

export type clientSideRecord = {
    id: string,
    name: string,
    ranking: string,
    time: string,
    removed: boolean
}

type jsonData = {
    setup: {
        boardName: string,
        rankOrder: string,
        timeFormat: string,
        numShow: number
    },
    nextId: number,
    records: record[]
}

const STORAGE_KEY = "cockatoo-timebaord-local"

function getData(): jsonData {
    const initialData: jsonData = {
        setup: {
            boardName: "Records",
            rankOrder: "shortest",
            timeFormat: "mm:ss.mss",
            numShow: 5
        },
        nextId: 0,
        records: []
    }

    let dataStr = localStorage.getItem(STORAGE_KEY)
    if (!dataStr) {
        return initialData
    } else {
        return JSON.parse(dataStr)
    }
}


function doRankings(records: record[]) {
    let playerNames: string[] = []
    let nextRank = 1
    let prevTime = NaN
    let prevRank = " "
    for (let r of records) {
        if (r.removed) {
            r.ranking = " "
        } else if (playerNames.includes(r.name)) {
            r.ranking = "-"
        } else {
            if (r.time == prevTime) {
                r.ranking = prevRank
            } else {
                r.ranking = nextRank.toString()
                prevRank = r.ranking
                prevTime = r.time
            }
            playerNames.push(r.name)
            nextRank += 1
        }
    }
    return records
}

function sortRecords(records: record[], rankOrder: string) {
    records.sort((a,b) => {
        if (rankOrder == "longest") {
            return b.time - a.time
        } else {
            return a.time - b.time
        }
    })
    return doRankings(records)
}

function insertRecord(records: record[], newRecord: record, rankOrder: string) {
    let result: record[] = []
    let i = 0
    if (rankOrder == "longest") {
        while (i < records.length && records[i].time >= newRecord.time) {
            result.push(records[i])
            i += 1
        }
    } else {
        while (i < records.length && records[i].time <= newRecord.time) {
            result.push(records[i])
            i += 1
        }
    }
    result.push(newRecord)
    while (i < records.length) {
        result.push(records[i])
        i += 1
    }
    return doRankings(result)
}

function setData(data: jsonData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getRecords() {
    let data = getData()
    let clientRecords: clientSideRecord[] = []

    for (let r of data.records) {
        clientRecords.push({
            id: r.id,
            name: r.name,
            ranking: r.ranking,
            removed: r.removed,
            time: formatTime(r.time, data.setup.timeFormat)
        })
    }
    return {
        boardName: data.setup.boardName,
        timeFormat: data.setup.timeFormat,
        numShow: data.setup.numShow,
        records: clientRecords
    }
}

export function getTop() {
    let recordsData = getRecords()
    let topRecords: clientSideRecord[] = []

    let i = 0

    while (i < recordsData.records.length && topRecords.length < recordsData.numShow) {
        if (recordsData.records[i].ranking != "-" && !recordsData.records[i].removed) {
            topRecords.push({
                id: recordsData.records[i].id,
                name: recordsData.records[i].name,
                ranking: recordsData.records[i].ranking,
                time: recordsData.records[i].time,
                removed: recordsData.records[i].removed
            })
        }
        i += 1
    }

    return {
        boardName: recordsData.boardName,
        records: topRecords
    }
}

export function formatTime(seconds: number, format: string) {
    let milliseconds = seconds % 1
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let millisecondsStr = (Math.round(milliseconds * 1000)).toString().padStart(3, "0")
    let secondsStr = Math.floor(seconds).toString().padStart(2, "0")
    let minutesStr = Math.floor(minutes).toString().padStart(2, "0")
    let hoursStr = Math.floor(hours).toString().padStart(2, "0")
    
    if (format == "hh:mm:ss.mss" || format == "hh:mm:ss") {
        minutesStr = Math.floor(minutes % 60).toString().padStart(2, "0")
        secondsStr = Math.floor(seconds % 60).toString().padStart(2, "0")
    } else if (format == "mm:ss" || !(format == "ss.mss")) {
        secondsStr = Math.floor(seconds % 60).toString().padStart(2, "0")
    }

    if (format == "ss.mss") {
        return `${secondsStr}.${millisecondsStr}`
    } else if (format == "mm:ss") {
        return `${minutesStr}:${secondsStr}`
    } else if (format == "hh:mm:ss.mss") {
        return `${hoursStr}:${minutesStr}:${secondsStr}.${millisecondsStr}`
    } else if (format == "hh:mm:ss") {
        return `${hoursStr}:${minutesStr}:${secondsStr}`
    } else {
        return `${minutesStr}:${secondsStr}.${millisecondsStr}`
    }
}

export function getSetup() {
    let data = getData()
    return data.setup
}

export function getSortOrder() {
    let setup = getSetup()
    return setup.rankOrder
}

export function updateSetup(rankOrder: string, boardName: string, timeFormat: string, numShow: number) {
    let data = getData()
    if (rankOrder != data.setup.rankOrder) {
        data.records = sortRecords(data.records, rankOrder)
    }
    data.setup.rankOrder = rankOrder
    data.setup.boardName = boardName
    data.setup.timeFormat = timeFormat
    data.setup.numShow = numShow
    setData(data)
}

export function addRecord(name: string, time: string) {
    let timeParts = time.split(":")
    let seconds = 0
    if (timeParts.length == 3) {
        seconds += (Number(timeParts[0]) * 3600)
        seconds += (Number(timeParts[1]) * 60)
        seconds += (Number(timeParts[2]))
    } else if (timeParts.length == 2) {
        seconds += (Number(timeParts[0]) * 60)
        seconds += (Number(timeParts[1]))
    } else {
        seconds = Number(timeParts[0])
    }

    let data = getData()
    let newRecord = {
        id: data.nextId.toString(),
        ranking: "",
        name: name,
        time: seconds,
        removed: false
    }
    data.records = insertRecord(data.records, newRecord, data.setup.rankOrder)
    data.nextId += 1
    setData(data)
}

export function removeRecord(id: string) {
    let data = getData()
    for (let r of data.records) {
        if (r.id == id) {
            r.removed = true
        }
    }
    data.records = doRankings(data.records)
    setData(data)
}

export function restoreRecord(id: string) {
    let data = getData()
    for (let r of data.records) {
        if (r.id == id) {
            r.removed = false
        }
    }
    data.records = doRankings(data.records)
    setData(data)
}

export function reset() {
    let data = getData()
    data.records = []
    data.nextId = 0
    setData(data)
}
