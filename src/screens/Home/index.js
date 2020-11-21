import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Header } from 'native-base';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { setLoading } from '@modules/reducers/auth/actions';
import { FoodService } from '@modules/services';
import { isEmpty } from '@utils/functions';
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
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        freeDelivery: 0,
        newest: 0,
        pizza: 0,
        hamburger: 0,
        dailyMenu: 0,
        soup: 0,
        salad: 0,
        money: 0,
        card: 0,
        withinOneHour: 0
    })

    useEffect(() => {
        const getFeatured = () => {
            dispatch(setLoading(true));
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
            FoodService.result(country, logged ? user.city.name : city.name, search, filters)
                .then((response) => {
                    if (response.status == 200) {
                        dispatch(setLoading(false));
                        setResult(response.result);
                    }
                })
                .catch((error) => {
                    dispatch(setLoading(false));
                    console.log(error.message);
                });
        }
        getResult();

        return () => console.log('Unmounted');
    }, []);

    useEffect(() => {
        setCityStatus(false);
        setFilterStatus(false);
        dispatch(setLoading(true));
        FoodService.featured(country, logged ? user.city.name : city.name)
            .then((response) => {
                setRefresh(false);
                if (response.status == 200) {
                    setFeatured(response.selectedLocation);
                }
            })
            .catch((error) => {
                setRefresh(false);
                console.log(error.message);
            });
        FoodService.trendy(country, logged ? user.city.name : city.name)
            .then((response) => {
                setRefresh(false);
                if (response.status == 200) {
                    setTrendy(response.selectedLocation);
                }
            })
            .catch((error) => {
                setRefresh(false);
                console.log(error.message);
            });
        FoodService.result(country, logged ? user.city.name : city.name, search, filters)
            .then((response) => {
                setRefresh(false);
                dispatch(setLoading(false));
                if (response.status == 200) {
                    setResult(response.result);
                }
            })
            .catch((error) => {
                setRefresh(false);
                dispatch(setLoading(false));
                console.log(error.message);
            });
    }, [country, city, user, refresh]);

    useEffect(() => {
        FoodService.result(country, logged ? user.city.name : city.name, search, filters)
            .then((response) => {
                if (response.status == 200) {
                    setResult(response.result);
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [search]);

    useEffect(() => {
        dispatch(setLoading(true));
        FoodService.result(country, logged ? user.city.name : city.name, search, filters)
            .then((response) => {
                if (response.status == 200) {
                    dispatch(setLoading(false));
                    setResult(response.result);
                }
            })
            .catch((error) => {
                dispatch(setLoading(false));
                console.log(error.message);
            });
    }, [filters]);

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
                        refresh={refresh}
                        search={search}
                        filters={filters}
                        onFilter={() => setFilterStatus(!filterStatus)}
                        onRefresh={() => setRefresh(true)}
                        onSearch={(value) => setSearch(value)}
                    /> :
                    <Filters
                        filters={filters}
                        onFilters={(value) => {
                            setFilters(value);
                            setFilterStatus(false);
                        }}
                        onCancel={() => setFilterStatus(false)}
                    /> :
                    <Cities
                        onSave={() => setCityStatus(false)}
                        onLoading={(load) => dispatch(setLoading(load))}
                    />
            }
        </Container>
    );
}

const styles = StyleSheet.create({

});