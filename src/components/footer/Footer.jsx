import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import { useRouter } from 'next/router'
import { StyledFooterBackground } from './Footer.style'
import FooterBottom from './FooterBottom'
import FooterMiddle from './FooterMiddle'

const Footer = ({ languageDirection }) => {    
    const router = useRouter()
  

   

   
    return (
        <>
            <StyledFooterBackground router={router.pathname}>
                <CustomStackFullWidth
                    height="100%"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingTop={{ xs: '20px', md: '50px' }}
                >
                    <FooterMiddle
                    />
                    <FooterBottom />
                </CustomStackFullWidth>
            </StyledFooterBackground>
        </>
    )
}

export default Footer
