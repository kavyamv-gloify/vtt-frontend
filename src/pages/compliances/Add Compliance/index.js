import React, {useState, useEffect} from 'react';
import SmartForm from '@smart-form';
import axios from 'axios';
import AppLoader from '@crema/core/AppLoader';
import {toast} from 'react-toastify';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Api from '@api';

const Create = ({editId, close, currComp}) => {
  const {user} = useAuthUser();
  const [showbtn, setshowbtn] = useState(true);
  const [data, setData] = useState({});
  useEffect(() => {
    if (!editId) return;
    axios
      .get(
        Api.baseUri +
          '/user-reg/compliance-topic/get-compliance-topic-byid/' +
          editId,
      )
      .then((el) => {
        setData(el?.data?.data);
        el?.data?.data?.complianceSubTopicList?.map((elm) => {
          if (elm?.subTopicName == 'Validity') {
            elm.inputTypeTem = 'Date';
            elm.subTopicKey = 'EXPIRYDATE';
          } else if (elm?.subTopicName == 'Document') {
            elm.inputTypeTem = 'File';
            elm.subTopicKey = 'DOCUMENT';
          } else {
            elm.subTopicKeyTem = elm.subTopicKey;
            elm.subTopicKey = 'ADDNEW';
          }
        });
      });
  }, [editId]);
  const topicList = [
    {title: 'Driving Licence', value: 'Driving Licence_'},
    {title: 'ID Card', value: 'ID_Card'},
    {title: 'Police Verification', value: 'Police Verification_'},
    {title: 'Badge', value: 'Badge'},
    {title: 'Medical Fitness', value: 'Medical Fitness_'},
  ];

  const topicList_vehicle = [
    {title: 'Registration', value: 'Registration_'},
    {title: 'Pollution', value: 'Pollution_'},
    {title: 'Insurance', value: 'Insurance_'},
    {title: 'Permit', value: 'Permit_'},
    {title: 'Fitness', value: 'Fitness_'},
    {title: 'Road Tax', value: 'Road Tax_'},
  ];
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'section',
                layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
                fields: [
                  {
                    type: 'text',
                    name: 'complianceGroupName',
                    id: 'complianceGroupName',
                    title: 'Group Name',
                    disabled: true,
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                  },
                ],
              },
              {
                type: 'section',
                layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
                fields: [
                  {
                    type: 'autocomplete',
                    name: 'complianceType',
                    id: 'complianceType',
                    title: 'For',
                    disabled: true,
                    options: [
                      {title: 'Driver', value: 'DRIVER'},
                      {title: 'Vehicle', value: 'VEHICLE'},
                    ],
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                  },
                  {
                    type: 'multiSelect',
                    name: 'accessTo',
                    id: 'accessTo',
                    title: 'Available For',
                    options: [
                      {title: 'Corporate Admin', value: 'Corporate Admin'},
                      {title: 'Vendor', value: 'Vendor'},
                    ],
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'section',
            layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'autocomplete',
                name: 'topicType',
                id: 'topicType',
                title: 'Type',
                options: [
                  {title: 'Existing', value: 'Existing'},
                  {title: 'New', value: 'New'},
                ],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'text',
                name: 'topicName',
                id: 'topicName',
                title: 'Name',
                dynamic: {
                  field: 'topicType',
                  value: 'New',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'autocomplete',
                name: 'topicName',
                id: 'topicName',
                title: 'Name',
                dynamic: {
                  field: 'topicType',
                  value: 'Existing',
                },
                validationProps: {
                  required: 'This is a mandatory field',
                },
                options:
                  (currComp?.complianceType == 'DRIVER'
                    ? topicList
                    : topicList_vehicle) || [],
              },
            ],
          },
          {
            type: 'array',
            name: 'complianceSubTopicList',
            id: 'complianceSubTopicList',
            layout: {
              column: 1,
              spacing: 2,
              size: 'small',
              label: 'blank',
              type: 'table',
            },
            columns: ['Sub Compliance Name', 'Input Type'],
            subFields: [
              {
                type: 'autocomplete',
                name: 'subTopicKey',
                id: 'subTopicKey',
                title: 'Sub Compliance Name',
                validationProps: {
                  required: 'This is a mandatory field',
                },
                options: [
                  {title: 'Expiry Date', value: 'EXPIRYDATE'},
                  {title: 'Document', value: 'DOCUMENT'},
                  {title: 'Add New', value: 'ADDNEW'},
                ],
                dynamic: {
                  field: 'subTopicKey',
                  arrName: 'complianceSubTopicList',
                  isNotValue: 'ADDNEW',
                  defaultShow: ' ',
                },
              },
              {
                type: 'text',
                name: 'subTopicKeyTem',
                id: 'subTopicKeyTem',
                title: 'Sub Compliance Name',
                validationProps: {
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'subTopicKey',
                  arrName: 'complianceSubTopicList',
                  value: 'ADDNEW',
                },
              },
              {
                type: 'text',
                name: 'inputTypeTem',
                id: 'inputTypeTem',
                title: 'Input Type',
                disabled: true,
                placeholder: 'Date',
                dynamic: {
                  field: 'subTopicKey',
                  arrName: 'complianceSubTopicList',
                  value: 'EXPIRYDATE',
                },
              },
              {
                type: 'text',
                name: 'inputTypeTem',
                id: 'inputTypeTem',
                disabled: true,
                placeholder: 'File',
                title: 'Input Type',
                dynamic: {
                  field: 'subTopicKey',
                  arrName: 'complianceSubTopicList',
                  value: 'DOCUMENT',
                },
              },
              {
                type: 'autocomplete',
                name: 'inputType',
                id: 'inputType',
                title: 'Input Type',
                validationProps: {
                  required: 'This is a mandatory field',
                },
                dynamic: {
                  field: 'subTopicKey',
                  arrName: 'complianceSubTopicList',
                  value: 'ADDNEW',
                  defaultShow: 'ADDNEW',
                },
                options: [
                  {title: 'Date', value: 'date'},
                  {title: 'File', value: 'file'},
                  {title: 'Text', value: 'text'},
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  function handleSubmit(val) {
    setshowbtn(false);
    if (val.button == 'submit') {
      // let topicKey_temp = '';
      // if (val?.data?.topicType == "New") { topicKey_temp = val?.data?.topicName }
      // else {
      //     topicList?.map(el => {
      //         if (el.value == val?.data?.topicName) {
      //             topicKey_temp = el.title;
      //         }
      //     })
      // }
      let compliances_tem = [];
      val?.data?.complianceSubTopicList?.map((el) => {
        el.subTopicKey = el.subTopicKeyTem || el.subTopicKey;
        let temobj = {};
        val.data.inputType =
          el.subTopicKey == 'EXPIRYDATE'
            ? 'date'
            : el.subTopicKey == 'DOCUMENT'
            ? 'file'
            : val.data.inputType;

        if (val?.data?.topicType == 'New') {
          temobj.subTopicName =
            el.subTopicKey == 'EXPIRYDATE'
              ? 'Validity'
              : el.subTopicKey == 'DOCUMENT'
              ? 'Document'
              : el.subTopicKey;
          temobj.subTopicKey =
            el.subTopicKey == 'EXPIRYDATE'
              ? 'Validity'
              : el.subTopicKey == 'DOCUMENT'
              ? 'Document'
              : el.subTopicKey;
          temobj.inputType = el.inputType;
        } else {
          if (val?.data?.topicName == 'Driving Licence_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicName = 'Validity';
              temobj.subTopicKey = 'dlValidity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicName = 'Document';
              temobj.subTopicKey = 'dlcenseDoc';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'ID_Card') {
            if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'govtIdProofDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Police Verification_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'policeverificationexpirydate';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'policeVerDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Badge') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'badgeExpDate';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Medical Fitness_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'medicalFitnessExpiryDate';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'medicalCertificateDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Registration_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'registrationExpDate';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'regCertDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Pollution_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'polutionTill';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'polutionDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Insurance_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'insuranceTill';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'insuranceDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Fitness_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'fitnessExpiryDate';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'fitnessCertDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Permit_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'permitExpiryDate';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'permitDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Road Tax_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'roadTaxValidityExpiry';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
        }
        compliances_tem.push(temobj);
      });
      let postData = {
        complianceGroupId: currComp?.id,
        topicNameKey:
          val?.data?.topicType == 'New'
            ? val?.data?.topicName
            : val?.data?.topicName?.slice(0, -1),
        topicName: val?.data?.topicName,
        // "topicType": val?.data?.topicType,
        complianceSubTopicList: compliances_tem,
        complianceType: val?.data?.complianceType,
        accessTo: val?.data?.accessTo,
        status: 'ACTIVE',
      };
      axios
        .post(
          Api.baseUri + '/user-reg/compliance-topic/save-compliance-topic',
          postData,
        )
        .then((res) => {
          setshowbtn(true);
          if (res?.data?.status == '200') {
            toast.success('Compliance added successfully.');
            close();
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((er) => {
          setshowbtn(true);
          toast.error('Something went wrong.');
        });
    }
  }
  function handleUpdate(val) {
    setshowbtn(false);
    if (val.button == 'update') {
      let topicKey_temp = '';
      if (val?.data?.topicType == 'New') {
        topicKey_temp = val?.data?.topicName;
      } else {
        topicList?.map((el) => {
          if (el.value == val?.data?.topicName) {
            topicKey_temp = el.title;
          }
        });
      }
      let compliances_tem = [];
      val?.data?.complianceSubTopicList?.map((el) => {
        el.subTopicKey = el.subTopicKeyTem || el.subTopicKey;
        let temobj = {};
        if (val?.data?.topicType == 'New') {
          temobj.subTopicName = el.subTopicKey;
          temobj.subTopicKey = el?.subTopicKey;
          temobj.inputType = el.inputType;
        } else {
          if (val?.data?.topicName == 'Driving Licence_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicName = 'Validity';
              temobj.subTopicKey = 'dlValidity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicName = 'Document';
              temobj.subTopicKey = 'dlcenseDoc';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'ID_Card') {
            if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'govtIdProofDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Police Verification_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'policeverificationexpirydate';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'policeVerDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Badge') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'badgeExpDate';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Medical Fitness_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'medicalFitnessExpiryDate';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'medicalCertificateDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Registration_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'registrationExpDate';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'regCertDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Pollution_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'polutionTill';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'polutionDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Insurance_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'insuranceTill';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'insuranceDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Fitness_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'fitnessExpiryDate';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'fitnessCertDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Permit_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'permitExpiryDate';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else if (el?.subTopicKey == 'DOCUMENT') {
              temobj.subTopicKey = 'permitDoc';
              temobj.subTopicName = 'Document';
              temobj.inputType = 'file';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
          if (val?.data?.topicName == 'Road Tax_') {
            if (el?.subTopicKey == 'EXPIRYDATE') {
              temobj.subTopicKey = 'roadTaxValidityExpiry';
              temobj.subTopicName = 'Validity';
              temobj.inputType = 'date';
            } else {
              temobj.subTopicName = el.subTopicKey;
              temobj.subTopicKey = el.subTopicKey;
              temobj.inputType = el.inputType;
            }
          }
        }
        compliances_tem.push(temobj);
      });
      let postData = {
        complianceGroupId: currComp?.id,
        topicNameKey:
          val?.data?.topicType == 'New'
            ? val?.data?.topicName
            : val?.data?.topicName?.slice(0, -1),
        // "topicNameKey": val?.data?.topicName,
        topicName: val?.data?.topicName,
        // "topicType": val?.data?.topicType,
        complianceSubTopicList: compliances_tem,
        complianceType: val?.data?.complianceType,
        accessTo: val?.data?.accessTo,
        status: 'ACTIVE',
      };
      axios
        .put(
          Api.baseUri + '/user-reg/compliance-topic/update-compliance-topic',
          {...data, ...postData},
        )
        .then((res) => {
          setshowbtn(true);
          if (res?.data?.status == '200') {
            toast.success('Compliance updated successfully.');
            close();
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((er) => {
          setshowbtn(true);
          toast.error('Something went wrong.');
        });
    }
  }
  return (
    <>
      {!showbtn ? <AppLoader /> : null}
      {editId && data?.id ? (
        <SmartForm
          template={template}
          defaultValues={{
            ...data,
            topicType:
              data?.topicName == data?.topicNameKey ? 'New' : 'Existing',
            complianceGroupName: currComp?.name,
          }}
          onSubmit={handleUpdate}
          buttons={['update']}
        />
      ) : null}
      {!editId ? (
        <SmartForm
          template={template}
          defaultValues={{
            complianceType: currComp?.complianceType,
            complianceGroupName: currComp?.name,
          }}
          onSubmit={handleSubmit}
          buttons={['submit']}
        />
      ) : null}
    </>
  );
};

export default Create;
