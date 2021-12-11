function soilinfo({ english_bangla, totalSoilAmount, remainSoilAmount }) {
    return (
        <div className='row mb-3'>
            <h2>
                জমির পরিমাণঃ&nbsp;
                {totalSoilAmount === 0
                    ? '০'
                    : english_bangla(totalSoilAmount)}{' '}
                শতক,&nbsp;
                {totalSoilAmount === 0
                    ? '০'
                    : english_bangla(
                          Math.floor(totalSoilAmount * 0.6060606060606061)
                      )}
                &nbsp; কাঠা
            </h2>

            <h2>
                বাকি আছেঃ&nbsp;
                {remainSoilAmount === 0
                    ? '০'
                    : english_bangla(Math.floor(remainSoilAmount))}
                &nbsp; শতক,&nbsp;
                {remainSoilAmount === 0
                    ? '০'
                    : english_bangla(
                          Math.floor(remainSoilAmount * 0.6060606060606061)
                      )}
                &nbsp; কাঠা
            </h2>
        </div>
    )
}

export default soilinfo
