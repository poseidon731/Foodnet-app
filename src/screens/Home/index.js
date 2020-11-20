import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { FoodService } from '@modules/services';
import { Cities, Dashboard, Filters } from '@components';
import { common, colors } from '@constants/themes';
import i18n from '@utils/i18n';

export default Home = (props) => {
    const dispatch = useDispatch();
    const { logged, country, city, user } = useSelector(state => state.auth);

    const [cityStatus, setCityStatus] = useState(false);
    const [filterStatus, setFilterStatus] = useState(false);
    const [featured, setFeatured] = useState([]);
    const [trendy, setTrendy] = useState([]);
    const [result, setResult] = useState([]);

    useEffect(() => {
        const getFeatured = () => {
            FoodService.featured(country, logged ? user.city.name : city.name)
                .then((response) => {
                    if (response.status == 200) {
                        setFeatured(response.selectedLocation);
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                });
        }
        getFeatured();
        const getTrendy = () => {
            FoodService.trendy(country, logged ? user.city.name : city.name)
                .then((response) => {
                    if (response.status == 200) {
                        setTrendy(response.selectedLocation);
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                });
        }
        getTrendy();
        const getResult = () => {
            FoodService.result(country, logged ? user.city.name : city.name)
                .then((response) => {
                    if (response.status == 200) {
                        setResult(response.selectedLocation);
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                });
        }
        getResult();

        return () => {
            console.log('Unmounted');
        }
    }, []);

    const setCity = () => {
        setCityStatus(false);
        FoodService.featured(country, logged ? user.city.name : city.name)
            .then((response) => {
                if (response.status == 200) {
                    setFeatured(response.selectedLocation);
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
        FoodService.trendy(country, logged ? user.city.name : city.name)
            .then((response) => {
                if (response.status == 200) {
                    setTrendy(response.selectedLocation);
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
        FoodService.filter(country, logged ? user.city.name : city.name)
            .then((response) => {
                if (response.status == 200) {
                    setFilter(response.selectedLocation);
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    return (
        <Container style={common.container}>
            <StatusBar />
            <Header style={common.header}>
                <View style={common.headerLeft}>
                    <TouchableOpacity onPress={() => {
                        setCityStatus(false);
                        props.navigation.openDrawer();
                    }}>
                        <Icon type='ionicon' name='menu' size={30} color={colors.YELLOW.PRIMARY} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={common.headerTitle} onPress={() => setCityStatus(!cityStatus)}>
                    <Text style={common.headerTitleText}>{!logged ? city.name : user.city.name}</Text>
                    <Icon type='material' name={cityStatus ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color={colors.BLACK} />
                </TouchableOpacity>
                <View style={common.headerRight} />
            </Header>
            {
                !cityStatus ? !filterStatus ?
                    <Dashboard
                        featured={featured}
                        trendy={trendy}
                        result={result}
                        onFilter={() => setFilterStatus(!filterStatus)}
                    /> : 
                    <Filters 
                        onCancel={()=>setFilterStatus(false)}
                    /> :
                    <Cities onSave={() => setCity()} onLoading={(load) => dispatch(setLoading(load))} />
            }
        </Container>
    );
}

const styles = StyleSheet.create({

});