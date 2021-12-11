function Input(props) {
    const {
        id,
        placeholder,
        value,
        banglaInput,
        english_bangla,
        setState,
        ongshidar,
        updateOngshidar,
        isUpdate,
        style,
    } = props

    // মোডাল এর ভ্যালু আপডেট করার জন্য
    if (isUpdate) {
        return (
            <div className="form-group">
                <label htmlFor={id}>{placeholder}</label>
                {/* যদি <input id="name"/> হয় তাহলে, english_bangla() ফাংশান call করবেনা */}
                <input
                    type="text"
                    value={id === 'name' ? value : english_bangla(value)}
                    className="form-control"
                    id={id}
                    placeholder={placeholder}
                    onChange={(e) => {
                        updateOngshidar(e, id)
                    }}
                />
            </div>
        )
    }

    return (
        <div className="form-group">
            <label htmlFor={id}>{placeholder}</label>
            <input
                type="text"
                className={style ? style : 'form-control'}
                id={id}
                placeholder={placeholder}
                onChange={(e) => {
                    // যদি banglaInput থাকে তাহলে কন্ডিশান সত্য
                    if (banglaInput) {
                        banglaInput(e, setState)
                    } else if (ongshidar) {
                        // এখানে আইডি বলতে ongshidarTemplate Object এর key কে বুঝানো হয়েছে। যেমনঃ name, ana, katha, gonda
                        ongshidar(e, id)
                    } else {
                        // যেই <Input banglaInput, ongshidar/> উক্ত দুটি props পাঠানো হয়নি। যেমনঃ মৌজার নাম
                        setState(e.target.value)
                    }
                }}
            />
        </div>
    )
}

export default Input
