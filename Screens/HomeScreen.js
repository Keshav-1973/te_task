//import liraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import axios from 'axios';
import { getLaunchList, getLandList, getAllList, getInitialData } from '../Components/FilterService';


const FormatText = (props) => {
  return (
    <Text style={{ color: "black", fontWeight: "bold" }}>
      {props.TextOne}
      <Text style={{ color: "#474f98" }}>
        {props.TextTwo}
      </Text>
    </Text>
  )

}

const Item = ({ data }) => {
  return (
    <View style={{ margin: 10, flex: 1, borderWidth: 1, borderColor: "#c9ccd1", borderRadius: 2, backgroundColor: "white" }}>
      <View style={{ justifyContent: "center", margin: 10, backgroundColor: "white" }}>
        <Image style={{ width: "100%", height: 150, alignSelf: "center", backgroundColor: "#c9ccd1" }} source={{ uri: data.links.mission_patch_small }} resizeMode="contain"
        />
        <Text style={{ color: "#474f98", fontWeight: "bold" }}>{`${data.mission_name} #${data.flight_number}`}</Text>
        {data.mission_id.length === 0 ? <FormatText TextOne="Mission Ids: " TextTwo="NA" /> : <FormatText TextOne="Mission Ids: " TextTwo={data.mission_id} />}
        <FormatText TextOne="Launch Year: " TextTwo={data.launch_year} />
        <FormatText TextOne="Successful Launch: " TextTwo={data.launch_success !== null &&
          data.launch_success.toString()} />
        <FormatText TextOne="Successful Landing: " TextTwo={(data.rocket &&
          data.rocket.first_stage !== null &&
          data.rocket.first_stage.cores[0] !== null &&
          data.rocket.first_stage.cores[0]
            .land_success !== null &&
          data.rocket.first_stage.cores[0].land_success.toString()) ||
          "-"} />
      </View>
    </View>)

}




const HomeComp = () => {
  const [data, setData] = useState({ programList: undefined })
  const [modalVisible, setModalVisible] = useState(false);
  const [btnData, setBtnData] = useState({
    yearFilter: "",
    launchFilter: "",
    landFilter: "",
  })
  const [yearList, setYearList] = useState([
    {
      year: 2006,
      isSelected: false
    },
    {
      year: 2007,
      isSelected: false
    },
    {
      year: 2008,
      isSelected: false
    }, {
      year: 2009,
      isSelected: false
    }, {
      year: 2010,
      isSelected: false
    }, {
      year: 2011,
      isSelected: false
    }, {
      year: 2012,
      isSelected: false
    }, {
      year: 2013,
      isSelected: false
    }, {
      year: 2014,
      isSelected: false
    }, {
      year: 2015,
      isSelected: false
    }, {
      year: 2016,
      isSelected: false
    }, {
      year: 2017,
      isSelected: false
    }, {
      year: 2018,
      isSelected: false
    }, {
      year: 2019,
      isSelected: false
    }, {
      year: 2020,
      isSelected: false
    }
  ])
  const [toggle, setToggle] = useState({ btn1: false, btn2: false, btn3: false, btn4: false })

  useEffect(() => {
    getFilteredData()
  }, [btnData]);

  const fetchLaunchData = async (launchFilter) => {
    setBtnData({ ...btnData, launchFilter: launchFilter })

  }
  const fetchLandData = async (launchFilter, landFilter) => {
    setBtnData({ ...btnData, launchFilter: launchFilter, landFilter: landFilter })
  }
  const FilterByYear = (year) => {
    setBtnData({ ...btnData, yearFilter: year })
  }

  const getFilteredData = async () => {
    const { launchFilter, yearFilter, landFilter } = btnData;

    if (
      (launchFilter !== "" || launchFilter !== undefined) &&
      landFilter === "" &&
      yearFilter === ""
    ) {
      let launchData = await getLaunchList(launchFilter);
      setData({ programList: launchData });
    } else if (
      (launchFilter !== "" || launchFilter !== undefined) &&
      (landFilter !== "" || landFilter !== undefined) &&
      yearFilter === ""
    ) {
      let landData = await getLandList(launchFilter, landFilter);
      setData({ programList: landData });
    } else if (
      (launchFilter !== "" || launchFilter !== undefined) &&
      (landFilter !== "" || landFilter !== undefined) &&
      (yearFilter !== "" || yearFilter !== undefined)
    ) {
      let allData = await getAllList(
        launchFilter,
        landFilter,
        yearFilter
      );
      setData({ programList: allData });
    } else {
      let response = await getInitialData();
      this.setState({ programList: response });
    }
  }

  const selectionHandler = (ind) => {
    let arr = yearList.map((item, index) => {
      if (ind == index) {
        item.isSelected = true;
      } else {
        item.isSelected = false

      }
      return { ...item }
    })
    setYearList(arr)
  }


  const PopUpView = () => {

    const renderFilterList = ({ item, index }) => {
      return (
        <TouchableOpacity onPress={() => { FilterByYear(item.year); selectionHandler(index) }}>
          <View style={item.isSelected === true ? styles.pressed : styles.isPress}>
            <Text>{item.year}</Text>
          </View>
        </TouchableOpacity>
      )

    }
    function handleReset() {
      setToggle({ ...toggle, btn1: false, btn2: false, btn3: false, btn4: false })
      const newState = yearList.map(obj => {
        return { ...obj, isSelected: false };
      });
      setYearList(newState)
      async function set() {
        let result = await getInitialData();
        setData({ programList: result });
      }
      set()
    }



    const getHeaderComp = () => {
      return (
        <>
          <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", }}>
            <Text style={{}}>Filters</Text>
            <TouchableOpacity 
            onPress={() => {
              handleReset();
              getFilteredData()
             }}
            >
              <Text style={{ color: "blue" }}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "black", width: "40%", alignSelf: "center", marginTop: 10 }}>
            <Text style={{ alignSelf: "center" }}>Launch Year</Text>
          </View>
        </>
      )

    }
    const getFooterComp = () => {
      return (
        <>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "black", alignSelf: "center", marginTop: 10 }}>
            <Text style={{ alignSelf: "center" }} numberOfLines={1}>Successful Launch</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={toggle.btn1 ? styles.pressed : styles.isPress} onPress={() => { fetchLaunchData("true"); setToggle({ ...toggle, btn1: true, btn2: false }) }}>
              <Text>True</Text>
            </TouchableOpacity>
            <TouchableOpacity style={toggle.btn2 ? styles.pressed : styles.isPress} onPress={() => { fetchLaunchData("false"); setToggle({ ...toggle, btn2: true, btn1: false }) }}>
              <Text>False</Text>
            </TouchableOpacity>
          </View>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "black", alignSelf: "center", marginTop: 10 }}>
            <Text style={{ alignSelf: "center" }} numberOfLines={1}>Successful Landing</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={toggle.btn3 ? styles.pressed : styles.isPress} onPress={() => { fetchLandData("true", "true"); setToggle({ ...toggle, btn3: true, btn4: false }) }}>
              <Text>True</Text>
            </TouchableOpacity>
            <TouchableOpacity style={toggle.btn4 ? styles.pressed : styles.isPress} onPress={() => { fetchLandData("true", "false"); setToggle({ ...toggle, btn4: true, btn3: false }) }}>
              <Text>False</Text>
            </TouchableOpacity>
          </View>
          <Pressable
            style={{
              borderRadius: 5,
              width: '50%',
              backgroundColor: "#2196F3",
            }}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </>
      )
    }


    return (

      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <FlatList
                data={yearList}
                renderItem={renderFilterList}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={getHeaderComp}
                ListFooterComponent={getFooterComp}
                ListHeaderComponentStyle={{ alignItems: "center" }}
                ListFooterComponentStyle={{ alignItems: "center" }}
                initialNumToRender={1}
              />
            </View>
          </View>
        </Modal>
      </View>
    )
  }


  const renderItem = ({ item }) => {
    return (<Item data={item} />)
  }

  return (
    <View style={styles.container}>


      {data.programList === undefined ? null : <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          width: 70,
          position: 'absolute',
          bottom: 10,
          right: 10,
          height: 70,
          backgroundColor: '#fff',
          borderRadius: 100,
          zIndex: 1
        }}
        onPress={() => setModalVisible(!modalVisible)}
      >
        <Text>Filter</Text>
      </TouchableOpacity>}
      {(data.programList === undefined) ? (<Text style={{ alignSelf: "center", fontSize: 25, fontWeight: "bold" }}>Loading Data Please Wait.....</Text>) : ((data.programList.length === 0) ? (<Text style={{ alignSelf: "center", fontSize: 25, fontWeight: "bold" }}>No Records for the{"\n"} selected filter(s).</Text>) : (<FlatList
        data={data.programList}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={item => item.flight_number}
      />))}

      {PopUpView()}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e8eaed',
  },
  centeredView: {
    flex: 1,
    marginHorizontal: 20
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    // padding: 10,
    elevation: 2,
    width: '100%',
    backgroundColor: "#2196F3",
    alignSelf: "center"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  isPress: {
    width: 50,
    height: 25,
    backgroundColor: "#b1db9a",
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  },
  pressed: {
    width: 50,
    height: 25,
    backgroundColor: "#7cba01",
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4

  }
});

//make this component available to the app
export default HomeComp;
