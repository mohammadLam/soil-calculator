import React, { useCallback, useState, useEffect } from 'react'
import Input from './Input'
import Table from './Table'
import Modal from './Modal'
import './css/style.css'
import Soilinfo from './Soilinfo'

function Main() {
    // State define
    const [showmodal, setShowModal] = useState(false)
    const [khotiyanNo, setKhotiyanNo] = useState('') // খতিয়ান নং
    const [daagNo, setDaagNo] = useState('') // দাগ নং
    const [mouja, setMouja] = useState('') // মৌজার নাম
    const [totalSoilAmount, setTotalSoilAmount] = useState(0) // মোট জমির পরিমাণ
    const [remainSoilAmount, setRemainSoil] = useState(0) // অবশিষ্ট জমির পরিমাণ
    const [landType, setLandType] = useState('decimal') // জমির ধরণঃ কাঠা, শতক, ছটাক
    const [isUpdate, setUpdate] = useState(false)
    const [updatedIndex, setUpdatedIndex] = useState(0)
    const [ongshidar, setOngshidar] = useState([
        // { name: "মোহাম্মাদ লাম", ana: 2, gonda: 0, kora: 0, kranti: 0, til: 0 }
    ])

    // এগুলো <Input /> Component render এর সময় তথ্য হিসেবে নিবে
    const information = [
        ['name', 'অংশীদারীর নাম লিখুন'],
        ['ana', 'অংশীদারীর আনা লিখুন'],
        ['gonda', 'অংশীদারীর গন্ডা লিখুন'],
        ['kora', 'অংশীদারীর কড়া লিখুন'],
        ['kranti', 'অংশীদারীর ক্রান্তি লিখুন'],
        ['til', 'অংশীদারীর তিল লিখুন'],
    ]

    const [invalidInput, setInvalidInput] = useState('form-control')

    let ongshidarTemplate = {
        name: '',
        ana: 0,
        gonda: 0,
        kora: 0,
        kranti: 0,
        til: 0,
    }

    // শুধু বাংলা ইনপুট নিবে
    const banglaInput = (e, setState) => {
        e.target.value = english_bangla(e.target.value) // ইনপুটকে বাংলা করলো
        banglaRegex(e) // রেগুলার এক্সপ্রেশান দিয়ে শুধু বাংলা নম্বরকে ইনপুট নিলো

        // যদি <input id="totalSoilAmount" /> হয় তাহলে কন্ডিশান সত্য
        if (e.target.id === 'totalSoilAmount') {
            setSoilAmount(e)
        } else {
            // যদি <Input /> component এ setState ফাংশান পাস করা হয় তাহলে কন্ডিশান সত্য হবে
            if (setState) setState(bangla_english(e.target.value))
        }
    }

    /*
        setSoilAmount(<input id="totalSoilAmount" />)
        এই ফাংশান <input id="totalSoilAmount" /> থেকে একটি নাম্বার নিবে। ধরলাম = totalSoilAmount
        এবং <select id="typeOfLand"></select> এর value অনুযায়ী totalSoilAmount এর মানকে শতকে রূপান্তর করবে
    */
    const setSoilAmount = e => {
        let { value } = e.target
        value = bangla_english(value) // বাংলা থেকে ইংরেজী করবে
        if (landType === 'sotak') {
            setTotalSoilAmount(value / 1000)
            ongshidar.length > 0 && setRemainSoil(value / 1000)
        } else if (landType === 'katha') {
            setTotalSoilAmount(value * 1.65)
            ongshidar.length < 0
                ? setRemainSoil(value * 1.65)
                : calculateRemainSoil()
        } else {
            setTotalSoilAmount(value)
            if (ongshidar.length) {
                calculateRemainSoil()
            } else {
                setRemainSoil(value)
            }
        }
    }

    // ongshidarTemplate অব্জেক্ট এর key সেট করা
    const setOngshidarObj = (e, type) => {
        // যদি <Input /> compnent এর id='name' হয় তাহলে কন্ডিশান সত্য
        // templateObject এর name key কে banglaInput() দিয়ে call করবোনা। তাই এই শর্ত
        if (type === 'name') {
            ongshidarTemplate['name'] = e.target.value
        } else {
            banglaInput(e)
            ongshidarTemplate[type] = Number(bangla_english(e.target.value))
        }
    }

    // অংশীদার তৈরি করা
    const createOngshidar = () => {
        let outputOngshidar = [...ongshidar] // মূল ongshidar অবজেক্টকে destructing করা হলো
        outputOngshidar.push(ongshidarTemplate) // নতুন অংশীদারকে অ্যারে অবজেক্টে push করা হলো
        setOngshidar(outputOngshidar) // স্টেট পরিবর্তন করা হলো
        ongshidarTemplate = {
            name: '',
            ana: 0,
            gonda: 0,
            kora: 0,
            kranti: 0,
            til: 0,
        } // ongshidarTemplate কে default করা হলো
        setShowModal(false) // মোডাল কে hide করা হলো
    }

    // অংশীদার আপডেট করা
    const updateOngshidar = (e, type) => {
        setOngshidar((prevState) => {
            let prev = [...prevState]
            let ongshidar = prev.splice(updatedIndex, 1)[0] // কাঙ্খিত অবজেক্টকে বের করে নিয়ে আসবে
            ongshidar[type] = bangla_english(e.target.value) // অবজেক্ট এর টাইপ যেমনঃ ana, gonda, kora, kranti
            prev.splice(updatedIndex, 0, ongshidar) // state এর মধ্যে মডিফাই করা অবজেক্ট কে ঢুকিয়ে দিবে
            return prev
        })
    }

    // ইউজারের তথ্য update করার জন্য Modal দেখানো
    const showModalForUpdate = (index) => {
        setUpdatedIndex(index)
        setShowModal(true)
        setUpdate(true)
    }

    // অংশীদার মুছে ফেলা
    const deleteOngshidar = (index) => {
        const outputOngshidar = [...ongshidar] // মূল ongshidar অবজেক্টকে destructing করা হলো
        outputOngshidar.splice(index, 1) // অ্যারে থেকে ১ টি এলিমেন্ট ডিলিট করা হলো
        setOngshidar(outputOngshidar) // স্টেট পরিবর্তন করা হলো
    }

    // বাংলা নম্বর ইনপুট নেওয়ার রেগুলার এক্সপ্রেশান
    const banglaRegex = (e) => {
        e.target.value = english_bangla(e.target.value)
        let regex = /[^০-৯]/gi
        e.target.value = e.target.value.replace(regex, '')
    }

    // ইংরেজী নাম্বার -> বাংলা নাম্বার
    const english_bangla = input => {
        let str = typeof input === 'string' ? input : String(input)
        let numbers = {
            0: '০',
            1: '১',
            2: '২',
            3: '৩',
            4: '৪',
            5: '৫',
            6: '৬',
            7: '৭',
            8: '৮',
            9: '৯',
        }
        let output = []
        for (let i = 0; i < str.length; i++) {
            if (numbers.hasOwnProperty(str[i])) {
                output.push(numbers[str[i]])
            } else {
                output.push(str[i])
            }
        }
        return output.join('').toString()
    }

    // বাংলা নাম্বার -> ইংরেজী নাম্বার
    const bangla_english = input => {
        let str = typeof input === 'string' ? input : String(input)
        let numbers = {
            '০': 0,
            '১': 1,
            '২': 2,
            '৩': 3,
            '৪': 4,
            '৫': 5,
            '৬': 6,
            '৭': 7,
            '৮': 8,
            '৯': 9,
        }
        let output = []
        for (let i = 0; i < str.length; i++) {
            if (numbers.hasOwnProperty(str[i])) {
                output.push(numbers[str[i]])
            } else {
                output.push(str[i])
            }
        }
        return output.join('').toString()
    }

    // জমির ধরণ select ইনপুট থেকে পরিবর্তন করলে এই ফাংশান call করবে
    const changeLandType = (e) => {
        if (e.target.value === 'sotak') {
            // landType State এর মান 'sotak'
            setLandType('sotak')

            // totalSoilAmount State এর মান পরিবর্তন করবে
            setTotalSoilAmount(0)
        } else if (e.target.value === 'katha') {
            setLandType('katha')
            setTotalSoilAmount(0)
        } else {
            setLandType('decimal')
            setTotalSoilAmount(0)
        }
    }

    // এটাই মূল ক্যলকুলেটর
    const calculateSoil = (ongshidarObj, soilType = 'decimal') => {
        let result = 0
        let ana = totalSoilAmount / 16

        // গন্ডা = আনা ÷ ২০
        let gonda = ana / 20 // গুন্ডাতে রুপান্তর
        let kora = gonda / 4 // কুড়াতে রুপান্তর
        let kranti = kora / 3 // কান্তিতে রুপান্তর
        let til = kranti / 20 // তিলে রুপান্তর

        // যদি আনা থাকে
        if (ongshidarObj.ana) {
            ana *= ongshidarObj.ana
            result += ana
        }

        // যদি গুন্ডা থাকে
        if (ongshidarObj.gonda) {
            gonda *= ongshidarObj.gonda
            result += gonda
        }

        // যদি কুড়া থাকে
        if (ongshidarObj.kora) {
            kora *= ongshidarObj.kora
            result += kora
        }

        // যদি কান্তি থাকে
        if (ongshidarObj.kranti) {
            kranti *= ongshidarObj.kranti
            result += kranti
        }

        // যদি তিল থাকে
        if (ongshidarObj.til) {
            til *= ongshidarObj.til
            result += til
        }

        // return result
        if (soilType === 'sotak') {
            return Math.round(result * 1000) // ছটাকের মান
        } else if (soilType === 'decimal') {
            return result
        } else if (soilType === 'katha') {
            return Math.round(result * 0.6060606060606061) // শতক * 0.6060606060606061 // কাঠা বের করা
        } else if (soilType === 'ekor') {
            return result / 1000 / 100 / 5 // ছটাক থেকে ডেসিমেল তারপর একরে রূপান্তর
        } else if ('hektor') {
            return result / 1000 / 100 / 247.11 // ছটাক থেকে ডেসিমেল তারপর একর তারপর হেক্টরে রূপান্তর
        }
    }

    // জমির অবশিষ্ট অংশ বের করার ফাংশান
    const calculateRemainSoil = useCallback(() => {
        let remain = 0
        ongshidar.forEach((user) => {
            remain += calculateSoil(user, 'decimal')
        })
        setRemainSoil(totalSoilAmount - remain)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // যখনিই অংশীদার এর যোগ হবে অথবা বিয়োগ হবে তখনিই এই Hook call হবে
    useEffect(() => {
        calculateRemainSoil()
    }, [ongshidar, calculateRemainSoil])

    useEffect(() => {
        document.getElementById('totalSoilAmount').value = ''
    }, [landType])

    return (
        <>
            <div className="container">
                <h1 className="mb-3">জমির পরিমাণ নির্ণয়:</h1>

                {/* জমির তথ্য - অপশনাল */}
                <div className="row">
                    <Input
                        placeholder="খতিয়ান নং"
                        id="khotiyan"
                        banglaInput={banglaInput}
                        english_bangla={english_bangla}
                        setState={setKhotiyanNo}
                        value={khotiyanNo}
                    />
                    <Input
                        placeholder="দাগ নং"
                        id="daag"
                        banglaInput={banglaInput}
                        english_bangla={english_bangla}
                        setState={setDaagNo}
                        value={daagNo}
                    />
                    <Input
                        placeholder="মৌজার নাম লিখুন"
                        id="mouja"
                        setState={setMouja}
                        english_bangla={english_bangla}
                        value={mouja}
                    />
                </div>

                {/* জমির পরিমাণ এবং ধরণ */}
                <div className="row">
                    <Input
                        placeholder="জমির পরিমাণ লিখুন"
                        style={invalidInput}
                        id="totalSoilAmount"
                        english_bangla={english_bangla}
                        banglaInput={banglaInput}
                        setState={setTotalSoilAmount}
                        value={totalSoilAmount}
                    />
                    <div className="form-group">
                        <label htmlFor="typeOfLand">জমির ধরণ</label>
                        <select
                            id="typeOfLand"
                            className="form-control"
                            onChange={changeLandType}
                        >
                            <option value="decimal">ডেসিমাল (শতক)</option>
                            <option value="sotak">ছটাক</option>
                            <option value="katha">কাঠা</option>
                        </select>
                    </div>
                </div>

                {/* <Soilinfo /> Component
                    english_bangla function কে props হিসেবে নিছি ইংরেজী লেখাকে বাংলাতে রূপান্তর করার জন্যে
                    totalSoilAmount state কে prop হিসেবে নিছি জমির মোট পরিমাণ পাওয়ার জন্যে
                    remainSoilAmount state কে prop হিসেবে নিছি জমির অবশিষ্ট পরিমাণ পাওয়ার জন্যে
                */}
                <Soilinfo
                    english_bangla={english_bangla}
                    totalSoilAmount={totalSoilAmount}
                    remainSoilAmount={remainSoilAmount}
                />

                {/* অংশীদার যোগ করুন Button */}
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        console.log(`totalSoilAmount=${totalSoilAmount}, remainSoilAmount=${remainSoilAmount}`)
                        // যদি totalSoilAmount এর মধ্যে value থাকে, তাহলে কন্ডিশান সত্য
                        if (totalSoilAmount && remainSoilAmount) {
                            setShowModal(true) // মোডাল show করাবে
                            setInvalidInput('form-control')
                            console.log('show modal')
                        }
                        // যখন মোট জমির পরিমাণ = ০ তখন কন্ডিশান সত্য
                        else if (!totalSoilAmount) {
                            console.log('Empty soil')
                            setInvalidInput('form-control invalid')
                        }
                    }}
                >
                    অংশীদার যোগ করুন
                </button>

                {/* Render Table */}
                {ongshidar.length > 0 ? (
                    <Table
                        ongshidar={ongshidar}
                        deleteOngshidar={deleteOngshidar}
                        showModalForUpdate={showModalForUpdate}
                        english_bangla={english_bangla}
                        calculateSoil={calculateSoil}
                    />
                ) : null}
            </div>

            <Modal
                title={
                    isUpdate === true
                        ? 'অংশীদারের তথ্য পরিবর্তন করুনঃ'
                        : 'অংশীদার তৈরি করুনঃ'
                }
                show={showmodal}
                onClose={() => setShowModal(false)}
            >
                {information.map((input, i) => (
                    // input[ 0: 'name', 1: 'অংশীদারীর নাম লিখুন']
                    <Input
                        placeholder={input[1]}
                        id={input[0]}
                        key={i}
                        english_bangla={english_bangla}
                        value={
                            ongshidar.length > 0 &&
                            ongshidar[updatedIndex][input[0]]
                        } // ongshidar[0].name
                        isUpdate={isUpdate}
                        updateOngshidar={updateOngshidar}
                        ongshidar={setOngshidarObj}
                    />
                ))}

                <div>
                    {/* সাবমিট বাটন */}
                    <button
                        className="btn btn-success"
                        onClick={() => {
                            if (isUpdate) {
                                setUpdate(false)
                                setShowModal(false)
                            } else {
                                createOngshidar()
                            }
                        }}
                    >
                        সাবমিট
                    </button>
                    &nbsp;&nbsp;
                    {/* মোডাল বন্ধ করার বাটন */}
                    <button
                        className="btn btn-danger"
                        onClick={() => {
                            if (isUpdate) {
                                setUpdate(false)
                                setShowModal(false)
                            } else {
                                setShowModal(false)
                            }
                        }}
                    >
                        বন্ধ করুন
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default Main
