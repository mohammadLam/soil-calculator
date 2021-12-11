import React from 'react'
function Table({ showModalForUpdate, ongshidar, deleteOngshidar, english_bangla, calculateSoil }) {

    return (
        <div className="table-container">
            <table className="table">
                <tbody>
                    <tr className="head">
                        <th>ক্রমিক নং</th>
                        <th>অংশীদারীর নাম</th>
                        <th>অংশীদারীর অংশ</th>
                        <th>জমির পরিমাণ</th>
                        <th>অ্যাকশান</th>
                    </tr>

                    {ongshidar.map((ongshidar, index) => (<tr key={index}>
                        <td>{english_bangla(index + 1)}</td>
                        <td>{ongshidar.name}</td>
                        <td>{english_bangla(ongshidar.ana)} আনা, {english_bangla(ongshidar.gonda)} গন্ডা, {english_bangla(ongshidar.kora)} কড়া, {english_bangla(ongshidar.kranti)} ক্রান্তি, {english_bangla(ongshidar.til)} তিল</td>
                        <td>
                            <span>{english_bangla(calculateSoil(ongshidar, "sotak"))} ছটাক,</span>&nbsp;
                            <span>{english_bangla(calculateSoil(ongshidar, "decimal"))} শতক,</span>&nbsp;
                            <span>{english_bangla(calculateSoil(ongshidar, "katha"))} কাঠা</span>&nbsp;
                            {/* <span>{english_bangla(calculateSoil(ongshidar, "ekor"))} একর</span> */}
                        </td>
                        <td>
                            <div className="btn-group">
                                <button className="btn btn-success btn-sm" onClick={() => showModalForUpdate(index)}>সংস্কার</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteOngshidar(index)}>মুছুন</button>
                            </div>
                        </td>
                    </tr>)
                    )}

                </tbody>
            </table>
        </div>
    )
}

export default React.memo(Table)