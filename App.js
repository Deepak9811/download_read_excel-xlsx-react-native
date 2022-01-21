import { Text, StyleSheet, View, StatusBar, Button, PermissionsAndroid } from 'react-native';
import React, { Component } from 'react';

import RNFS, { writeFile, readFile } from 'react-native-fs';
import XLSX from 'xlsx';

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: "deepak",
    }
  }



  handleClick = async () => {

    try {
      // Check for Permission (check if permission is already given or not)
      let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

      if (!isPermitedExternalStorage) {

        // Ask for permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage permission needed",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );


        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission Granted (calling our this.readExcellFile function)
          this.readExcellFile();
          console.log("Permission granted");
        } else {
          // Permission denied
          console.log("Permission denied");
        }
      } else {
        // Already have Permission (calling our this.readExcellFile function)
        this.readExcellFile();
      }
    } catch (e) {
      console.log('Error while checking permission');
      console.log(e);
      return
    }

  };


  async readExcellFile() {


    //---------------------CONVERT-JSON-TO-EXCEL/XLSX/-&-DOWNLOAD------------------------------------------------------

    // var data = [
    //   { "name": "Deepak Singh", "city": "New Delhi" },
    //   { "name": "Rishab", "city": "New Delhi" },
    //   { "name": "Munim sir", "city": "New York" }
    // ];

    // var ws = XLSX.utils.json_to_sheet(data);

    // var wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, "Prova");

    // const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });
    // var RNFS = require('react-native-fs');
    // var file = RNFS.ExternalStorageDirectoryPath + '/Celect.xlsx';
    // writeFile(file, wbout, 'ascii').then((r) => {console.log("Success",r)}).catch((e) => {console.log(e.message) });




    // --------------------READ-EXCEL/XLSX-&-CONVERT-JSON----------------------------------------------------

    var file = RNFS.ExternalStorageDirectoryPath
    console.log(file)

    const filePath = RNFS.ExternalStorageDirectoryPath + '/Celect.xlsx';
    const excelFile = await RNFS.readFile(filePath, 'ascii');
    // console.log(excelFile)
    const workbook = XLSX.read(excelFile, { type: 'binary', bookType: "xlsx" });

    const wsname = workbook.SheetNames[0];
    const ws = workbook.Sheets[wsname];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    // this.setState({
    //   data: workbook
    // })
    console.log("excelFile :-", data)
  }







  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <StatusBar barStyle={'light-content'} />
        <Button title='Import excel file' onPress={() => this.handleClick()} />

        <Text>{this.state.data}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
