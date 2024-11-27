import { getConvertDiscount } from '../../../utils/customFunctions'

export const handleInitialTotalPriceVarPriceQuantitySet = (
    product,
    setModalData,
    productUpdate,
    setTotalPrice,
    setVarPrice,
    setQuantity,
    setSelectedOptions,
    setTotalWithoutDiscount
) => {
    console.log("modal inside initial",product);
    setModalData([product])
    if (productUpdate) {
        setTotalPrice(product.totalPrice)
        setVarPrice(product.totalPrice)
    } else {
        setTotalPrice(product?.item_details?.price.value)
        setVarPrice(product?.item_details?.price.value)
        setTotalWithoutDiscount(product?.item_details?.price.value)
    }
    if (product?.quantity) {
        setQuantity(product?.item_details?.quantity?.available?.count)
    }
    else{
        setQuantity(1)
    }
    let selectedOption = []
    if (product?.variations?.length > 0) {

        product?.variations?.forEach((item) => {
            if (item?.values?.length > 0) {
                item?.values?.forEach((value) => {
                    if (value?.isSelected) {
                        selectedOption.push(value)
                    }
                })
            }
        })
    }
    if(productUpdate){
        setSelectedOptions(product?.selectedOptions)
    }else {
        if (selectedOption.length > 0) {
            setSelectedOptions(selectedOption)
        }else{
            setSelectedOptions([])
        }
    }

}
