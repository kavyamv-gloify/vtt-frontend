/* eslint-disable */
import React from 'react';
import SmartForm from '@smart-form';
import Steppers from '@smart-form/stepper';

const Test = () => {
	/*let template = {
		layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed', type: 'grid' },
		title: 'Sample Form',
		description: 'NEW FORM',
		sections: [
			{
				layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
				title: 'Personal Information',
				id: 'personal_information',
				fields: [
					{
						type: 'text',
						name: 'firstname',
						id: 'firstname',
						title: 'First Name',
						disabled: false,
						validationProps: {
							required: 'This is a mandatory field'
						}
					},
					{
						type: 'multiSelect',
						name: 'ms',
						id: 'ms',
						title: 'Multi Select',
						options: [
							{ value: 1, title: 'Name 1' },
							{ value: 2, title: 'Name 2' },
							{ value: 3, title: 'Name 3' },
							{ value: 4, title: 'Name 4' },
							{ value: 5, title: 'Name 5' },
							{ value: 6, title: 'Name 6' }
						]
					},
					{
						type: 'multiSelect',
						name: 'ms2',
						id: 'ms2',
						title: 'Multi Select 2',
						options: [
							{ value: 1, title: 'Name 1' },
							{ value: 2, title: 'Name 2' },
							{ value: 3, title: 'Name 3' },
							{ value: 4, title: 'Name 4' },
							{ value: 5, title: 'Name 5' },
							{ value: 6, title: 'Name 6' }
						]
					},
					{
						type: 'text',
						name: 'firstname',
						id: 'firstname',
						title: 'First Name',
						validationProps: {
							required: 'This is a mandatory field'
						}
					},
					{
						type: 'text',
						name: 'lastname',
						id: 'lastname',
						title: 'Last Name',
						defaultValue: "Manish",
						validationProps: {
							required: 'This is a mandatory field'
						}
					},
					{
						type: 'email',
						name: 'email',
						id: 'email',
						title: 'Email Address',
						validationProps: {
							required: 'This is a mandatory field'
						}
					},
					{
						type: 'tel',
						name: 'phone_number',
						id: 'phone',
						title: 'Phone Number',
						validationProps: {
							required: 'This is a mandatory field'
						}
					},
					{
						type: 'text',
						name: 'location',
						id: 'location',
						title: 'Location',
						validationProps: {
							required: 'This is a mandatory field'
						}
					},
					{
						type: 'select',
						name: 'country',
						id: 'country',
						title: 'Country',
						options: [
							{ title: 'India', value: 'ind' },
							{ title: 'South Africa', value: 'sa' }
						]
					},
					{
						type: 'radio',
						name: 'gender',
						id: 'gender',
						title: 'Gender',
						options: [{ title: "Male", value: "Male" }, { title: "Female", value: "Female" }, { title: "Others", value: "Others" }]
					},
					{
						type: 'attachment',
						name: 'document',
						id: 'document',
						title: 'document'
					}
				]
			}
		]
	};*/
	let stepperTemplate = {
		title:"New Stepper Form",
		layout: {type: 'horizontal', position:'center', labelPos: 'top', maxWidth: '80%', margin: '10px 20px'},		
		steps: [
			{
				layout: {},
				title: 'Step 1',
				buttons: ['next'],
				buttonStyle: {
					type: 'square',
					text: true,
					icon: '',
					size: '',
					bgColor: '',
					textColor: '',
					fontSize: '',
				},
				form: {
					layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed', type: 'grid' },
					sections: [
						{
							layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
							id: 'personal_information',
							fields: [
								{
									type: 'text',
									name: 'firstname',
									id: 'firstname',
									title: 'First Name',
									disabled: false,
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'text',
									name: 'lastname',
									id: 'lastname',
									title: 'Last Name',
									defaultValue: "Manish",
									validationProps: {
										// required: 'This is a mandatory field'
									}
								},
								{
									type: 'email',
									name: 'email',
									id: 'email',
									title: 'Email Address',
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'tel',
									name: 'phone_number',
									id: 'phone',
									title: 'Phone Number',
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'text',
									name: 'location',
									id: 'location',
									title: 'Location',
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'select',
									name: 'country',
									id: 'country',
									title: 'Country',
									options: [
										{ title: 'India', value: 'ind' },
										{ title: 'South Africa', value: 'sa' }
									]
								},
								{
									type: 'radio',
									name: 'gender',
									id: 'gender',
									title: 'Gender',
									options: [{ title: "Male", value: "Male" }, { title: "Female", value: "Female" }, { title: "Others", value: "Others" }]
								}
							]
						}
					]
				}
			},
			{
				layout: {},
				title: 'Step 2',
				buttons: ['next'],
				buttonStyle: {
					type: 'square',
					text: true,
					icon: '',
					size: '',
					bgColor: '',
					textColor: '',
					fontSize: '',
				},
				form: {
					layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed', type: 'grid' },
					sections: [
						{
							layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
							fields: [
								{
									type: 'text',
									name: 'firstname',
									id: 'firstname',
									title: 'First Name',
									disabled: false,
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'text',
									name: 'lastname',
									id: 'lastname',
									title: 'Last Name',
									defaultValue: "Manish",
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'email',
									name: 'email',
									id: 'email',
									title: 'Email Address',
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'tel',
									name: 'phone_number',
									id: 'phone',
									title: 'Phone Number',
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'text',
									name: 'location',
									id: 'location',
									title: 'Location',
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'select',
									name: 'country',
									id: 'country',
									title: 'Country',
									options: [
										{ title: 'India', value: 'ind' },
										{ title: 'South Africa', value: 'sa' }
									]
								},
								{
									type: 'radio',
									name: 'gender',
									id: 'gender',
									title: 'Gender',
									options: [{ title: "Male", value: "Male" }, { title: "Female", value: "Female" }, { title: "Others", value: "Others" }]
								}
							]
						}
					]
				}
			},
			{
				layout: {},
				title: 'Step 3',
				buttons: ['next'],
				buttonStyle: {
					type: 'square',
					text: true,
					icon: '',
					size: '',
					bgColor: '',
					textColor: '',
					fontSize: '',
				},
				form: {
					layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed', type: 'grid' },
					sections: [
						{
							layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
							fields: [
								{
									type: 'text',
									name: 'firstname',
									id: 'firstname',
									title: 'First Name',
									disabled: false,
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'text',
									name: 'lastname',
									id: 'lastname',
									title: 'Last Name',
									defaultValue: "Manish",
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'email',
									name: 'email',
									id: 'email',
									title: 'Email Address',
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'tel',
									name: 'phone_number',
									id: 'phone',
									title: 'Phone Number',
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'text',
									name: 'location',
									id: 'location',
									title: 'Location',
									validationProps: {
										required: 'This is a mandatory field'
									}
								},
								{
									type: 'select',
									name: 'country',
									id: 'country',
									title: 'Country',
									options: [
										{ title: 'India', value: 'ind' },
										{ title: 'South Africa', value: 'sa' }
									]
								},
								{
									type: 'radio',
									name: 'gender',
									id: 'gender',
									title: 'Gender',
									options: [{ title: "Male", value: "Male" }, { title: "Female", value: "Female" }, { title: "Others", value: "Others" }]
								}
							]
						}
					]
				}
			}
		]
	}
	
	let template = {
		layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed', type: 'grid' },
		title: 'Sample Form',
		description: 'NEW FORM',
		sections: [
			{
				layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
				title: 'Personal Information',
				id: 'personal_information',
				fields: [
					{
						type: 'text',
						name: 'firstname',
						id: 'firstname',
						title: 'First Name',
						disabled: false,
						validationProps: {
							required: 'This is a mandatory field'
						}
					},
					{
						type: 'multiSelect',
						name: 'ms',
						id: 'ms',
						title: 'Multi Select',
						options: [
							{ value: 1, title: 'Name 1' },
							{ value: 2, title: 'Name 2' },
							{ value: 3, title: 'Name 3' },
							{ value: 4, title: 'Name 4' },
							{ value: 5, title: 'Name 5' },
							{ value: 6, title: 'Name 6' }
						]
					},
					{
						type: 'multiSelect',
						name: 'ms2',
						id: 'ms2',
						title: 'Multi Select 2',
						options: [
							{ value: 1, title: 'Name 1' },
							{ value: 2, title: 'Name 2' },
							{ value: 3, title: 'Name 3' },
							{ value: 4, title: 'Name 4' },
							{ value: 5, title: 'Name 5' },
							{ value: 6, title: 'Name 6' }
						]
					},
					{
						type: 'text',
						name: 'firstname',
						id: 'firstname',
						title: 'First Name',
						validationProps: {
							required: 'This is a mandatory field'
						}
					},
					{
						type: 'text',
						name: 'lastname',
						id: 'lastname',
						title: 'Last Name',
						defaultValue: "Manish",
						validationProps: {
							required: 'This is a mandatory field'
						}
					},
					{
						type: 'email',
						name: 'email',
						id: 'email',
						title: 'Email Address',
						validationProps: {
							required: 'This is a mandatory field'
						}
					},
					{
						type: 'tel',
						name: 'phone_number',
						id: 'phone',
						title: 'Phone Number',
						validationProps: {
							required: 'This is a mandatory field'
						}
					},
					{
						type: 'text',
						name: 'location',
						id: 'location',
						title: 'Location',
						validationProps: {
							required: 'This is a mandatory field'
						}
					},
					{
						type: 'select',
						name: 'country',
						id: 'country',
						title: 'Country',
						options: [
							{ title: 'India', value: 'ind' },
							{ title: 'South Africa', value: 'sa' }
						]
					},
					{
						type: 'radio',
						name: 'gender',
						id: 'gender',
						title: 'Gender',
						options: [{ title: "Male", value: "Male" }, { title: "Female", value: "Female" }, { title: "Others", value: "Others" }]
					},
					{
						type: 'attachment',
						name: 'document',
						id: 'document',
						title: 'document'
					}
				]
			}
		]
	};
	return (
    <>
		<Steppers
			// defaultValues={usdata}
			template={stepperTemplate}
			// watchFields={['firstname', 'include_portfolio', 'email', 'country']}
			// validate={validate}
			onSubmit={data=>{}}
			buttons={['submit']}
		/>
      	<SmartForm
			// defaultValues={usdata}
			template={template}
			// watchFields={['firstname', 'include_portfolio', 'email', 'country']}
			// validate={validate}
			onSubmit={data=>{}}
			buttons={['submit']}
		/>
    </>
  );
};

export default Test;
