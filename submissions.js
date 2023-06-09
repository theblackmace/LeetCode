module.exports = [
    {   
        dbId: 1,
        user: 'arihantnayyar@gmail.com',
        pid: 1,
        attempts: [
            {
                attemptNum: 1,
                language: "python",
                code: `def find_max(arr):
                arr = arr.strip('[]')  # Remove the square brackets from the input string
                elements = arr.split(',')  # Split the string into individual elements
                elements = [int(num) for num in elements]  # Convert the elements to integers
                maximum = elements[0]  # Initialize the maximum with the first element
            
                for num in elements:
                    if num > maximum:
                        maximum = num
            
                return maximum`
            }
        ]
    }
];