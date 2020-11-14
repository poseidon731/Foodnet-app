import React from 'react'
import { View } from 'react-native'
import Svg, { Circle, Ellipse, G, Text, TSpan, TextPath, Path, Polygon, Polyline, Line, Rect, Use, Image, Symbol, Defs, LinearGradient, RadialGradient, Stop, ClipPath, Pattern, Mask } from 'react-native-svg'

const LogoIcon = ({ style }) => (
    <View style={style}>
        <Svg width="70" height="70" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/Svg">
            <Path d="M4.08092 55.8073L1.42102 55.8055L1.42662 47.5786L6.29924 47.5819L6.2979 49.5564L4.08518 49.5549L4.08439 50.6831L6.06787 50.6845L6.06652 52.659L4.08305 52.6576L4.08092 55.8073Z" fill="#F78F1E" />
            <Path d="M10.1826 50.3473C9.83068 50.7153 9.65457 51.1736 9.65423 51.7219C9.65384 52.2705 9.83124 52.729 10.1864 53.0974C10.5416 53.466 10.9789 53.6503 11.4988 53.6507C12.0185 53.651 12.4562 53.4672 12.8119 53.0992C13.1675 52.7313 13.3456 52.2729 13.3459 51.7244C13.3463 51.176 13.1689 50.7176 12.8137 50.349C12.4585 49.9805 12.0211 49.7961 11.5014 49.7957C10.9816 49.7954 10.542 49.9793 10.1826 50.3473ZM8.39103 54.7651C7.53542 53.9576 7.10817 52.9425 7.10901 51.7202C7.10985 50.498 7.5385 49.4836 8.39512 48.6771C9.25168 47.8707 10.28 47.4679 11.48 47.4687C12.68 47.4695 13.7078 47.8738 14.5633 48.6813C15.4186 49.489 15.8461 50.5039 15.8453 51.7262C15.8445 52.9485 15.4156 53.9629 14.5592 54.7692C13.7025 55.5757 12.6742 55.9785 11.4743 55.9777C10.2742 55.9768 9.24642 55.5726 8.39103 54.7651Z" fill="#F78F1E" />
            <Path d="M19.6981 50.3474C19.3463 50.7155 19.1702 51.1738 19.1699 51.7221C19.1694 52.2707 19.3469 52.7291 19.702 53.0975C20.0572 53.4662 20.4945 53.6504 21.0144 53.6508C21.5341 53.6512 21.9718 53.4674 22.3275 53.0993C22.6831 52.7314 22.8611 52.2731 22.8615 51.7246C22.8619 51.1762 22.6845 50.7177 22.3293 50.3491C21.9742 49.9807 21.5367 49.7962 21.017 49.7959C20.4972 49.7955 20.0576 49.9794 19.6981 50.3474ZM17.9067 54.7652C17.051 53.9577 16.6238 52.9427 16.6246 51.7203C16.6255 50.4981 17.0541 49.4838 17.9107 48.6773C18.7672 47.8709 19.7956 47.468 20.9956 47.4689C22.1955 47.4696 23.2233 47.874 24.0789 48.6815C24.9343 49.4891 25.3617 50.5041 25.3609 51.7263C25.3601 52.9487 24.9312 53.9631 24.0748 54.7694C23.2181 55.5759 22.1898 55.9786 20.9899 55.9778C19.7898 55.977 18.762 55.5728 17.9067 54.7652Z" fill="#F78F1E" />
            <Path d="M29.0207 49.9612L29.0183 53.5341L29.133 53.5342C29.6375 53.5345 30.0292 53.3821 30.3084 53.0766C30.5876 52.7713 30.7274 52.3289 30.7277 51.7489C30.7282 51.1692 30.5889 50.7263 30.3102 50.4205C30.0314 50.1148 29.6399 49.9617 29.1353 49.9614L29.0207 49.9612ZM29.0511 55.8613L26.4142 55.8594L26.4198 47.6325L29.0567 47.6344C30.2871 47.6351 31.3074 48.0139 32.1171 48.7706C32.9267 49.5273 33.3311 50.5207 33.3303 51.7506C33.3295 52.9809 32.9236 53.9737 32.113 54.7292C31.3022 55.4848 30.2815 55.862 29.0511 55.8613Z" fill="#F78F1E" />
            <Path d="M40.0622 55.9809L37.0036 52.3121L37.0012 55.8379L34.3987 55.836L34.4042 47.7384L35.826 47.4691L38.8846 51.1381L38.887 47.6122L41.4895 47.614L41.484 55.7117L40.0622 55.9809Z" fill="#F78F1E" />
            <Path d="M47.898 53.8885L47.8966 55.863L42.875 55.8597L42.8805 47.6328L47.8104 47.6361L47.8091 49.6106L45.539 49.6091L45.5384 50.6785L47.5791 50.68L47.5777 52.6543L45.537 52.6529L45.5362 53.887L47.898 53.8885Z" fill="#F78F1E" />
            <Path d="M48.7267 49.9599L48.7282 47.6328L54.6213 47.6368L54.6197 49.9639L53.0031 49.9627L52.999 55.8626L50.3392 55.8607L50.3432 49.9609L48.7267 49.9599Z" fill="#F78F1E" />
            <Path d="M18.0038 19.8208C17.3929 19.8882 16.988 20.2471 16.7506 20.7889C16.3665 21.6657 16.4723 22.5248 16.9246 23.3455C17.346 24.1101 18.0079 24.603 18.8046 24.9277C19.8557 25.356 20.9445 25.4036 22.0511 25.2328C23.4103 25.023 24.6954 24.5887 25.9011 23.9265C26.6729 23.5026 27.3861 23.0001 27.9521 22.3142C28.0871 22.1506 28.2037 21.9719 28.3305 21.7977C28.3453 21.8052 28.3603 21.8106 28.3726 21.8196C28.9425 22.2376 29.5897 22.4813 30.2722 22.6269C32.2635 23.0515 34.2323 22.9378 36.1718 22.3304C37.0236 22.0637 37.7799 21.6239 38.4141 20.9907C39.1398 20.266 39.5773 19.4103 39.5283 18.3603C39.4896 17.5311 39.1796 16.819 38.5193 16.2915C37.9369 15.8263 37.2349 15.79 36.6552 16.1854C36.3516 16.3925 36.1392 16.6683 36.1225 17.0524C36.1177 17.1637 36.153 17.2767 36.1698 17.3889C36.1834 17.388 36.1971 17.3871 36.2106 17.3863C36.2245 17.3511 36.2368 17.3154 36.2525 17.281C36.4207 16.9099 36.7164 16.7104 37.1149 16.6876C37.4875 16.6663 37.7822 16.8203 37.9725 17.1545C38.3071 17.7417 38.1471 18.4154 37.5681 18.7849C37.0772 19.0982 36.5312 19.2326 35.9514 19.2158C35.4126 19.2003 34.9059 19.039 34.417 18.8273C33.7413 18.5349 33.0767 18.2164 32.3993 17.9279C31.5896 17.583 30.7519 17.3674 29.8586 17.4457C28.9489 17.5255 28.2527 17.9388 27.7963 18.7385C27.7773 18.7719 27.7565 18.8043 27.7302 18.8476C27.6931 18.8193 27.6713 18.8026 27.6494 18.7859C27.6241 18.7667 27.5993 18.747 27.5736 18.7285C26.9705 18.293 26.3089 18.1309 25.5737 18.289C24.9418 18.4248 24.3829 18.7103 23.8709 19.0964C23.2952 19.5305 22.8122 20.0604 22.3307 20.5918C21.9028 21.0642 21.4806 21.5424 20.9787 21.941C20.297 22.4825 19.528 22.726 18.6607 22.5974C18.0431 22.5058 17.6713 22.0824 17.6284 21.4605C17.5984 21.0247 17.804 20.673 18.1881 20.5032C18.5576 20.3398 19.0084 20.4305 19.294 20.7252C19.3132 20.7449 19.3356 20.7616 19.373 20.794C19.3753 20.5105 19.2677 20.3023 19.0772 20.1373C18.7688 19.8701 18.4021 19.7768 18.0038 19.8208Z" fill="#F78F1E" />
            <Path d="M48.9533 27.3986C47.9539 30.7713 46.1051 33.8706 43.5854 36.3884C39.5582 40.4157 34.2038 42.6338 28.5091 42.6338C22.8153 42.6338 17.4618 40.4157 13.4346 36.3884C12.9028 35.8575 12.3955 35.2951 11.9215 34.7101C11.9739 34.7129 12.0262 34.7147 12.0777 34.7173C12.817 34.7453 13.588 34.7598 14.3681 34.7598C14.8357 34.7598 15.344 34.7535 15.9226 34.7409C16.7974 34.7201 17.711 34.6812 18.6418 34.6262C21.5153 36.763 24.926 37.8916 28.5091 37.8916C31.4178 37.8916 34.2814 37.1241 36.7902 35.6707C39.1997 34.2759 41.2355 32.2826 42.6826 29.9038C43.5393 29.6113 44.369 29.3106 45.1499 29.0092C46.1005 28.6454 47.015 28.2688 47.8672 27.8924C48.231 27.7317 48.5948 27.5665 48.9533 27.3986Z" fill="#F78F1E" />
            <Path d="M49.963 18.4536L49.6516 18.7118L49.5956 18.3118C49.5757 18.1729 49.5559 18.0338 49.5342 17.8957L49.5314 17.8776C49.4132 17.1463 49.2543 16.4106 49.0593 15.692C48.9284 15.2127 48.7777 14.7269 48.6106 14.2494L48.4653 13.8359L48.886 13.9578C49.5134 14.1392 50.1066 14.3496 50.651 14.5825C51.6937 15.0303 51.6891 15.859 51.6873 16.1317C51.6873 16.1515 51.6864 16.1678 51.6873 16.1804V16.1831C51.7451 16.5424 51.2323 17.4019 49.963 18.4536ZM7.6094 27.1139C5.28295 26.5217 4.32957 25.7462 4.2574 25.3688L4.2565 25.368C4.18427 24.9824 5.36779 23.6653 6.84204 22.4926L7.18148 22.2227L7.20769 22.656C7.22925 23.0144 7.26005 23.3674 7.29706 23.7032C7.38822 24.5329 7.52994 25.3652 7.71955 26.1786C7.76647 26.3844 7.81972 26.5993 7.88294 26.8368L7.98133 27.2078L7.6094 27.1139ZM55.9141 15.3661C55.6649 14.0616 54.726 13.1426 52.776 12.293C51.5122 11.7424 49.6398 11.3533 47.3603 11.1682L47.2394 11.1583L47.1806 11.0517C47.0353 10.7891 46.8954 10.5462 46.7527 10.3106C46.5956 10.0506 46.434 9.79598 46.2724 9.55408C46.0287 9.18568 45.7697 8.82098 45.5006 8.46804C45.0258 7.84056 44.5066 7.23032 43.9578 6.65166C43.8341 6.52074 43.705 6.38803 43.5614 6.24451C39.536 2.21815 34.1816 0 28.4861 0C22.7913 0 17.437 2.21815 13.4097 6.24451C11.3361 8.31814 9.74177 10.7331 8.67102 13.4215C8.37766 14.1582 8.12395 14.9165 7.91631 15.6766C7.78545 16.1579 7.67077 16.6445 7.57597 17.1247C7.52905 17.3622 7.48481 17.6059 7.44601 17.8478C7.38912 18.1936 7.33945 18.5628 7.29706 18.9438L7.28345 19.0684L7.17157 19.1225C5.73977 19.815 4.42258 20.5543 3.46114 21.2025C0.793397 23.0036 -0.187813 25.0438 0.0287779 26.1768C0.265303 27.4227 1.14914 29.1713 4.01001 30.4343C5.77409 31.2125 8.12395 31.746 10.993 32.0213L11.0056 32.0222C11.8353 32.1017 12.7047 32.1595 13.5893 32.1938C14.2926 32.2218 15.032 32.2354 15.7867 32.2354C16.2634 32.2354 16.7671 32.229 17.2853 32.2173C18.1186 32.1974 18.9528 32.1622 19.7653 32.1144L19.8808 32.108L19.9539 32.1974C20.5705 32.954 21.5013 33.2509 22.7994 33.1047C24.6953 32.8907 26.5911 32.6018 28.3578 32.3211C28.5583 32.2895 28.7108 32.2434 28.8047 32.1216C29.0078 31.8571 28.9446 31.6783 28.8679 31.5528C28.7271 31.3208 28.5285 31.2441 28.2062 31.2946C26.4431 31.5763 24.6448 31.83 22.8618 32.0484C22.5648 32.0855 22.3092 32.0665 22.1025 31.9933C22.0547 31.9753 22.0177 31.9591 21.9843 31.9419C21.7324 31.8182 21.569 31.5925 21.5175 31.2919C21.4652 30.9922 21.5446 30.7268 21.7459 30.5246C21.7784 30.492 21.8073 30.4659 21.838 30.4433C22.0213 30.298 22.2849 30.1987 22.6144 30.1535C22.9403 30.1093 23.2653 30.0678 23.5903 30.0253C23.9478 29.9793 24.3062 29.9332 24.6637 29.8836C25.6919 29.74 26.7951 29.5812 27.8947 29.397C28.0464 29.3717 28.2486 29.3112 28.3515 29.1658C28.4165 29.0738 28.4364 28.9519 28.4111 28.8013C28.3741 28.589 28.263 28.3146 27.725 28.3859C27.6519 28.395 27.5788 28.4094 27.5011 28.4238C27.4388 28.4347 27.3774 28.4464 27.3142 28.4563C25.4653 28.7479 23.8458 28.9754 22.3634 29.1533C22.0385 29.1921 21.7378 29.1289 21.5166 28.9754C21.4886 28.9574 21.4553 28.9312 21.4254 28.905C21.253 28.7533 21.1528 28.5439 21.1383 28.3028C21.1266 28.1024 21.1591 27.9255 21.234 27.7756C21.2503 27.744 21.2666 27.7151 21.2846 27.6881C21.4317 27.4569 21.699 27.3053 22.0745 27.2412C22.1883 27.2231 22.3002 27.2105 22.4095 27.1987C22.4591 27.1933 22.5088 27.1879 22.5584 27.1825C24.4182 26.9451 25.9537 26.7239 27.3883 26.4874C27.613 26.4503 27.7846 26.3583 27.8712 26.2292C27.9371 26.1299 27.9543 26.0098 27.9218 25.8717C27.8668 25.6396 27.7385 25.3833 27.2384 25.4645C26.2101 25.6306 25.1611 25.7787 24.1464 25.9231C23.3195 26.0405 22.4645 26.1615 21.6249 26.2914C20.5236 26.4621 19.8664 26.8891 19.4935 27.6754L19.4872 27.6881L19.4366 27.8271L19.2895 27.8325C18.2369 27.8912 17.1986 27.9237 16.2056 27.93C15.7199 27.9336 15.2162 27.9309 14.6646 27.9201C14.2375 27.911 13.8124 27.8966 13.3998 27.8767L13.258 27.8695L13.203 27.7386C13.1515 27.6167 13.1 27.4949 13.0513 27.3712C12.9782 27.1843 12.906 26.9902 12.8374 26.7943C12.7507 26.5488 12.6667 26.2878 12.5864 26.0179L12.5114 25.7633L12.5195 25.7624C12.3887 25.2948 12.2785 24.819 12.191 24.3442C12.0077 23.3565 11.9147 22.3391 11.9147 21.3199C11.9147 21.0093 11.9237 20.6979 11.94 20.3892L11.921 20.4054L11.9716 19.8682C11.9897 19.6678 12.0077 19.4881 12.0285 19.3203C12.2993 17.0723 13.0179 14.9382 14.1644 12.9774C14.6799 12.0945 15.283 11.253 15.9564 10.4767C19.1125 6.83219 23.6797 4.74226 28.4861 4.74226C31.1447 4.74226 33.789 5.38957 36.1325 6.61369C37.0335 7.08316 37.8983 7.64199 38.7036 8.2739C40.4884 9.67413 41.9455 11.3903 43.0333 13.3755C43.3556 13.9641 43.6445 14.5771 43.8919 15.1964C44.5626 16.8792 44.9499 18.654 45.042 20.4704C45.0555 20.7394 45.0618 21.0057 45.0628 21.2639C45.0636 21.2711 45.0636 21.2775 45.0636 21.2847V21.4273L44.9354 21.4959C44.5039 21.7018 44.0688 21.9022 43.6409 22.09C42.9467 22.3951 42.2109 22.6984 41.4517 22.9918C40.8802 23.2139 40.2735 23.4378 39.6488 23.6572L39.5179 23.7041L39.4168 23.6066C38.8517 23.0595 38.0879 22.8979 37.0822 23.1155C34.8749 23.5931 32.9602 24.699 31.3921 26.4043C31.1312 26.6878 30.9244 27.0164 30.7782 27.3811C30.4631 28.162 30.6165 28.766 31.2612 29.2833C31.522 29.4927 31.7568 29.6371 31.9779 29.7238C34.4091 30.6744 36.8475 30.7187 39.2281 29.8565C39.9097 29.6101 40.7394 29.082 40.8188 27.9688C40.8188 27.9625 40.8197 27.9562 40.8197 27.9499L40.8314 27.8027L40.9705 27.754C41.625 27.5247 42.2551 27.2935 42.8437 27.0679C43.7302 26.7284 44.6095 26.3673 45.4555 25.9945C46.3059 25.6198 47.1184 25.2343 47.8713 24.8479C48.1087 24.727 48.3443 24.6033 48.5701 24.4814C50.8035 23.2798 52.5585 22.0385 53.7845 20.7918C55.2514 19.3013 55.9953 17.7639 55.9953 16.2219C55.9953 15.9357 55.9683 15.6478 55.9141 15.3661Z" fill="#F78F1E" />
            <Path d="M19.4063 15.3958C19.7323 15.3958 20.039 15.1987 20.1625 14.8757C20.2319 14.7327 20.7942 14.2208 21.9907 13.8361C23.1827 13.453 23.9369 13.5391 24.0809 13.6146C24.455 13.8588 24.9566 13.7551 25.203 13.3819C25.4502 13.0074 25.3471 12.5034 24.9726 12.2562C23.9464 11.5787 22.0501 12.1101 21.4933 12.2891C20.9365 12.4681 19.0859 13.1414 18.6469 14.2899C18.4867 14.709 18.6955 15.1816 19.1146 15.3418C19.2107 15.3784 19.3094 15.3959 19.4063 15.3958Z" fill="#F78F1E" />
            <Path d="M27.9922 13.1107C28.2478 13.1107 28.4988 12.9901 28.6562 12.764C28.7581 12.6419 29.4271 12.2803 30.6809 12.1947C31.9301 12.1096 32.6414 12.3748 32.7629 12.4827C33.0673 12.8098 33.5791 12.8298 33.9081 12.5267C34.2382 12.2228 34.2594 11.7088 33.9554 11.3787C33.1225 10.4743 31.1539 10.5337 30.5703 10.5736C29.9869 10.6133 28.0287 10.8216 27.3263 11.8307C27.0699 12.1989 27.1588 12.7078 27.5271 12.9641C27.6692 13.0631 27.8316 13.1107 27.9922 13.1107Z" fill="#F78F1E" />
        </Svg>
    </View>
);

const BackIcon = ({ style }) => (
    <View style={style}>
        <Svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/Svg">
            <Path d="M19 12H5" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 19L5 12L12 5" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    </View>
);

const GoogleIcon = ({ style }) => (
    <View style={style}>
        <Svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/Svg">
            <Path d="M22.9887 12.2242C22.9887 11.2409 22.9104 10.5234 22.7411 9.77933H11.7288V14.2173H18.1927C18.0625 15.3202 17.3587 16.9812 15.7948 18.0973L15.7729 18.2458L19.2548 20.996L19.496 21.0206C21.7115 18.9344 22.9887 15.865 22.9887 12.2242Z" fill="#4285F4" />
            <Path d="M11.7288 23.9179C14.8956 23.9179 17.5542 22.8548 19.4961 21.0212L15.7949 18.0979C14.8044 18.8021 13.4751 19.2938 11.7288 19.2938C8.62715 19.2938 5.99463 17.2077 5.05622 14.3243L4.91866 14.3362L1.29814 17.193L1.25079 17.3272C3.17956 21.2337 7.1414 23.9179 11.7288 23.9179Z" fill="#34A853" />
            <Path d="M5.0565 14.3238C4.80889 13.5797 4.66559 12.7824 4.66559 11.9586C4.66559 11.1347 4.80889 10.3375 5.04347 9.59342L5.03691 9.43494L1.37102 6.53223L1.25107 6.59039C0.456137 8.21149 0 10.0319 0 11.9586C0 13.8853 0.456137 15.7056 1.25107 17.3267L5.0565 14.3238Z" fill="#FBBC05" />
            <Path d="M11.7288 4.62403C13.9313 4.62403 15.4169 5.59401 16.264 6.40461L19.5742 3.10928C17.5413 1.1826 14.8956 0 11.7288 0C7.1414 0 3.17956 2.68406 1.25079 6.59056L5.04319 9.59359C5.99463 6.7102 8.62715 4.62403 11.7288 4.62403Z" fill="#EB4335" />
        </Svg>

    </View>
);

const InboxIcon = ({ style }) => (
    <View style={style}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/Svg">
            <Path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3 6H21" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    </View>
);

const OrderIcon = ({ style }) => (
    <View style={style}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    </View>
);

const ProfileIcon = ({ style }) => (
    <View style={style}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    </View>
);

const CouponIcon = ({ style }) => (
    <View style={style}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M19 5L5 19" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M6.5 9C7.88071 9 9 7.88071 9 6.5C9 5.11929 7.88071 4 6.5 4C5.11929 4 4 5.11929 4 6.5C4 7.88071 5.11929 9 6.5 9Z" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M17.5 20C18.8807 20 20 18.8807 20 17.5C20 16.1193 18.8807 15 17.5 15C16.1193 15 15 16.1193 15 17.5C15 18.8807 16.1193 20 17.5 20Z" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    </View>
);

const LocationIcon = ({ style }) => (
    <View style={style}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    </View>
);

const LanguageIcon = ({ style }) => (
    <View style={style}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3V15Z" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M4 22V15" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    </View>
);

const ServiceIcon = ({ style }) => (
    <View style={style}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M9.09003 8.99999C9.32513 8.33166 9.78918 7.7681 10.4 7.40912C11.0108 7.05015 11.7289 6.91893 12.4272 7.0387C13.1255 7.15848 13.7588 7.52151 14.2151 8.06352C14.6714 8.60552 14.9211 9.29151 14.92 9.99999C14.92 12 11.92 13 11.92 13" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 17H12.01" stroke="#F78F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    </View>
);

const MapPinIcon = ({ style }) => (
    <View style={style}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#C6C6C6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#C6C6C6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    </View>
);

const ErrorIcon = ({ style }) => (
    <View style={style}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#F05050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 8V12" stroke="#F05050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 16H12.01" stroke="#F05050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    </View>
);

const InternetIcon = ({ style }) => (
    <View style={style}>
        <Svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" stroke="#F05050" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M24 16V24" stroke="#F05050" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M24 32H24.0196" stroke="#F05050" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    </View>
);

export {
    LogoIcon,
    BackIcon,
    GoogleIcon,
    InboxIcon,
    OrderIcon,
    ProfileIcon,
    CouponIcon,
    LocationIcon,
    LanguageIcon,
    ServiceIcon,
    MapPinIcon,
    ErrorIcon,
    InternetIcon
}