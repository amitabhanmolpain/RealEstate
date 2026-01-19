import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion";

const Contact = () => {
    const [result, setResult] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        setResult("Sending....");
        const formData = new FormData(event.target);

        formData.append("access_key", "795acc3c-76f4-4b05-856e-9692d9ebe7c8");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setResult("");
            toast.success("Form Submitted Successfully");
            event.target.reset();
        } else {
            console.log("Error", data);
            toast.error(data.message);
            setResult("");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 200 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            className="text-center p-6 py-20 lg:px-32 w-full overflow-hidden" id="Contact">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
                Contact <span className="underline underline-offset-4 decoration-1 font-light">With Us</span>
            </h1>
            <p className="text-center text-gray-500 mb-12 max-w-80 mx-auto">
                Ready to Make a Move? Let's Build Your Future Together
            </p>

            <form onSubmit={onSubmit} className="max-w-2xl mx-auto text-gray-600 pt-8">
                <div className="flex flex-wrap">
                    {/* Name Input */}
                    <div className="w-full md:w-1/2 text-left">
                        Your Name
                        <input className="w-full border border-gray-300 rounded py-3 px-4 mt-2" 
                        type="text" name="Name" placeholder="Your Name" required />
                    </div>
                    {/* Email Input */}
                    <div className="w-full md:w-1/2 text-left md:pl-4">
                        Your Email
                        <input className="w-full border border-gray-300 rounded py-3 px-4 mt-2" 
                        type="email" name="Email" placeholder="Your Email" required />
                    </div>
                </div>

                {/* Message Textarea */}
                <div className="my-6 text-left">
                    Message
                    <textarea className="w-full border border-gray-300 rounded py-3 px-4 mt-2 h-48 resize-none"
                        name="Message" placeholder="Message" required></textarea>
                </div>

                {/* Submit Button */}
                <button className="bg-red-300 text-white py-2 px-12 mb-10 rounded hover:bg-red-400">
                    {result ? result : "Send Message"}
                </button>
            </form>
        </motion.div>
    );
}

export default Contact;
